import {
  Button,
  createListCollection,
  DialogActionTrigger,
  DialogTitle,
  HStack,
  Input,
  NativeSelect,
  NumberInput,
  Select,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useId, useState } from "react"
import { Controller, type SubmitHandler, useForm } from "react-hook-form"
import { FaPlus } from "react-icons/fa"
import {
  type ItemCreate,
  ItemCreateSchema,
  ItemsService,
  TaxesService,
} from "@/client"
import type { ApiError } from "@/client/core/ApiError"
import useCustomToast from "@/hooks/useCustomToast"
import { handleError } from "@/utils"
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTrigger,
} from "../ui/dialog"
import { Field } from "../ui/field"

const AddItem = () => {
  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient()
  const { showSuccessToast } = useCustomToast()
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<ItemCreate>({
    mode: "onBlur",
    criteriaMode: "all",
    resolver: zodResolver(ItemCreateSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "0",
      duration: "0",
      custom_taxes: [],
    },
  })

  const { data: categories } = useQuery({
    queryKey: ["itemCategories"],
    queryFn: ItemsService.readItemCategories,
    enabled: isOpen,
  })

  const { data: taxes } = useQuery({
    queryKey: ["allTaxes"],
    queryFn: TaxesService.readAllTaxes,
    enabled: isOpen,
  })

  const taxList = createListCollection({
    items: taxes?.results
      ? taxes.results.map((tax) => ({
          label: `${tax.name} ${tax.rate} ${tax.rate_type === "percentages" ? "%" : ""}`,
          value: tax.id,
        }))
      : [],
  })

  const mutation = useMutation({
    mutationFn: (data: ItemCreate) =>
      ItemsService.createItem({ requestBody: data }),
    onSuccess: () => {
      showSuccessToast("Item created successfully.")
      reset()
      setIsOpen(false)
    },
    onError: (err: ApiError) => {
      handleError(err)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] })
    },
  })

  const onSubmit: SubmitHandler<ItemCreate> = (data) => {
    mutation.mutate(data)
  }

  return (
    <DialogRoot
      size={{ base: "xs", md: "md" }}
      placement="center"
      open={isOpen}
      onOpenChange={({ open }) => setIsOpen(open)}
    >
      <DialogTrigger asChild>
        <Button value="add-item" colorPalette="gray" size="sm">
          <FaPlus fontSize="16px" />
          Add Item
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Add Item</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <Text mb={4}>Fill in the details to add a new item.</Text>
            <VStack gap={4}>
              <Field
                invalid={!!errors.category_id}
                errorText={errors.category_id?.message}
                label="Category"
              >
                <NativeSelect.Root>
                  <NativeSelect.Field
                    id={useId()}
                    {...register("category_id", { valueAsNumber: true })}
                    placeholder="Select category"
                  >
                    {categories?.results.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </NativeSelect.Field>
                </NativeSelect.Root>
              </Field>
              <Field
                required
                invalid={!!errors.name}
                errorText={errors.name?.message}
                label="Name"
              >
                <Input
                  id={useId()}
                  {...register("name", {
                    required: "Name is required.",
                  })}
                  placeholder="Name"
                  type="text"
                />
              </Field>

              <HStack gap="10" width="full">
                <Field
                  invalid={!!errors.price}
                  errorText={errors.price?.message}
                  label="Price"
                >
                  <Controller
                    name="price"
                    control={control}
                    render={({ field }) => (
                      <NumberInput.Root
                        disabled={field.disabled}
                        name={field.name}
                        value={field.value}
                        onValueChange={({ value }) => {
                          field.onChange(parseFloat(value))
                        }}
                      >
                        <NumberInput.Control />
                        <NumberInput.Input onBlur={field.onBlur} />
                      </NumberInput.Root>
                    )}
                  />
                </Field>
                <Field
                  invalid={!!errors.duration}
                  errorText={errors.duration?.message}
                  label="Duration"
                >
                  <Controller
                    name="duration"
                    control={control}
                    render={({ field }) => (
                      <NumberInput.Root
                        disabled={field.disabled}
                        name={field.name}
                        value={field.value}
                        onValueChange={({ value }) => {
                          field.onChange(parseFloat(value))
                        }}
                      >
                        <NumberInput.Control />
                        <NumberInput.Input onBlur={field.onBlur} />
                      </NumberInput.Root>
                    )}
                  />
                </Field>
              </HStack>

              <Field
                invalid={!!errors.custom_taxes}
                errorText={errors.custom_taxes?.message}
                label="Taxes"
              >
                <Controller
                  control={control}
                  name="custom_taxes"
                  render={({ field }) => (
                    <Select.Root<{ label: string; value: number }>
                      multiple
                      name={field.name}
                      value={field.value}
                      onValueChange={({ value }) => {
                        console.log("value", value)
                        field.onChange(value.map(String))
                      }}
                      onInteractOutside={() => field.onBlur()}
                      collection={taxList}
                      size="sm"
                    >
                      <Select.HiddenSelect />
                      <Select.Control>
                        <Select.Trigger>
                          <Select.ValueText placeholder="Select taxes" />
                        </Select.Trigger>
                        <Select.IndicatorGroup>
                          <Select.Indicator />
                        </Select.IndicatorGroup>
                      </Select.Control>
                      <Select.Positioner>
                        <Select.Content>
                          {taxList.items.map((taxList) => (
                            <Select.Item
                              item={taxList}
                              key={String(taxList.value)}
                            >
                              {taxList.label}
                              <Select.ItemIndicator />
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Positioner>
                    </Select.Root>
                  )}
                />
              </Field>

              <Field
                invalid={!!errors.description}
                errorText={errors.description?.message}
                label="Description"
              >
                <Textarea
                  id={useId()}
                  {...register("description")}
                  placeholder="Description"
                />
              </Field>
            </VStack>
          </DialogBody>

          <DialogFooter gap={2}>
            <DialogActionTrigger asChild>
              <Button
                variant="subtle"
                colorPalette="gray"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </DialogActionTrigger>
            <Button
              variant="solid"
              type="submit"
              disabled={!isValid}
              loading={isSubmitting}
            >
              Save
            </Button>
          </DialogFooter>
        </form>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  )
}

export default AddItem
