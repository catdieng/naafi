import {
  Button,
  ButtonGroup,
  Center,
  CloseButton,
  createListCollection,
  Dialog,
  Field,
  Fieldset,
  HStack,
  Input,
  Portal,
  Select,
  Stack,
  Steps,
  Textarea,
} from "@chakra-ui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { Controller, type SubmitHandler, useForm } from "react-hook-form"
import {
  type ApiError,
  type OrganizationCreate,
  OrganizationCreateSchema,
  OrganizationService,
} from "@/client"
import useCustomToast from "@/hooks/useCustomToast"
import { handleError } from "@/utils"

const countries = createListCollection({
  items: [{ label: "Canada", value: "CA" }],
})

const businessTypes = createListCollection({
  items: [
    { label: "Agriculture", value: "agriculture" },
    { label: "Construction", value: "construction" },
    { label: "Education", value: "education" },
    { label: "Finance", value: "finance" },
    { label: "Healthcare", value: "healthcare" },
    { label: "Hospitality", value: "hospitality" },
    { label: "Manufacturing", value: "manufacturing" },
    { label: "Retail", value: "retail" },
    { label: "Technology", value: "technology" },
    { label: "Transportation", value: "transportation" },
    { label: "Other", value: "other" },
  ],
})

function AddOrganization() {
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState(0)
  const queryClient = useQueryClient()
  const { showSuccessToast } = useCustomToast()

  const {
    control,
    register,
    reset,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<OrganizationCreate>({
    mode: "all",
    resolver: zodResolver(OrganizationCreateSchema),
    defaultValues: {
      name: "",
      description: "",
      industry: "",
      zip_code: "",
      phone_number: "",
      email: "",
      full_name: "",
      address: "",
    },
  })

  const stepFields: Record<number, (keyof OrganizationCreate)[]> = {
    0: ["name", "description", "industry"],
    1: ["full_name", "phone_number", "email", "zip_code", "address"],
  }

  const mutation = useMutation({
    mutationFn: (data: OrganizationCreate) =>
      OrganizationService.createOrganization({ requestBody: data }),
    onSuccess: () => {
      showSuccessToast("Organization created successfully.")
      reset()
      setStep(0)
    },
    onError: (err: ApiError) => {
      handleError(err)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] })
    },
  })

  const onSubmit: SubmitHandler<OrganizationCreate> = (data) => {
    mutation.mutate(data)
  }

  return (
    <Center>
      <Dialog.Root
        size="lg"
        open={isOpen}
        onOpenChange={({ open }) => setIsOpen(open)}
      >
        <Dialog.Trigger asChild>
          <Button color="white" variant="solid">
            Create Organization
          </Button>
        </Dialog.Trigger>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner as="form" onSubmit={handleSubmit(onSubmit)}>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Create an organization</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Fieldset.Root>
                  <Stack gap="4">
                    <Steps.Root
                      variant="subtle"
                      defaultStep={0}
                      step={step}
                      onStepChange={(e) => setStep(e.step)}
                      count={2}
                    >
                      <Steps.List>
                        <Steps.Item
                          key={0}
                          index={0}
                          title="Organization details"
                        >
                          <Steps.Indicator />
                          <Steps.Title>Organization details</Steps.Title>
                          <Steps.Separator />
                        </Steps.Item>
                        <Steps.Item key={1} index={1} title="Contact details">
                          <Steps.Indicator />
                          <Steps.Title>Contact details</Steps.Title>
                          <Steps.Separator />
                        </Steps.Item>
                      </Steps.List>

                      <Steps.Content key={0} index={0}>
                        <Field.Root>
                          <Stack>
                            <Fieldset.HelperText>
                              Please provide your organization details below.
                            </Fieldset.HelperText>
                          </Stack>
                          <Fieldset.Content>
                            <Field.Root invalid={!!errors.name}>
                              <Field.Label>Business name</Field.Label>
                              <Input
                                {...register("name")}
                                placeholder="Enter your business name"
                              />
                              <Field.ErrorText>
                                {errors.name?.message}
                              </Field.ErrorText>
                            </Field.Root>
                            <Field.Root invalid={!!errors.industry}>
                              <Controller
                                control={control}
                                name="industry"
                                render={({ field, fieldState: { error } }) => (
                                  <>
                                    <Select.Root
                                      {...field}
                                      onValueChange={(value) => {
                                        field.onChange(value.value[0])
                                      }}
                                      collection={businessTypes}
                                      size="sm"
                                      value={field.value ? [field.value] : []}
                                    >
                                      <Select.HiddenSelect />
                                      <Select.Label>Industry</Select.Label>
                                      <Select.Control>
                                        <Select.Trigger>
                                          <Select.ValueText placeholder="Select an industry type" />
                                        </Select.Trigger>
                                        <Select.IndicatorGroup>
                                          <Select.Indicator />
                                        </Select.IndicatorGroup>
                                      </Select.Control>
                                      <Select.Positioner>
                                        <Select.Content>
                                          {businessTypes.items.map(
                                            (businessType) => (
                                              <Select.Item
                                                item={businessType}
                                                key={businessType.value}
                                              >
                                                {businessType.label}
                                              </Select.Item>
                                            ),
                                          )}
                                        </Select.Content>
                                      </Select.Positioner>
                                    </Select.Root>
                                    <Field.ErrorText>
                                      {error?.message}
                                    </Field.ErrorText>
                                  </>
                                )}
                              />
                            </Field.Root>
                            <Field.Root invalid={!!errors.description}>
                              <Field.Label>Description</Field.Label>
                              <Textarea {...register("description")} rows={4} />
                              <Field.ErrorText>
                                {errors.description?.message}
                              </Field.ErrorText>
                            </Field.Root>
                          </Fieldset.Content>
                        </Field.Root>
                      </Steps.Content>
                      <Steps.Content key={1} index={1}>
                        <Field.Root>
                          <Stack>
                            <Fieldset.HelperText>
                              Please provide your contact details below.
                            </Fieldset.HelperText>
                          </Stack>
                          <Fieldset.Content>
                            <Field.Root invalid={!!errors.full_name}>
                              <Field.Label>Full name</Field.Label>
                              <Input {...register("full_name")} />
                              <Field.ErrorText>
                                {errors.full_name?.message}
                              </Field.ErrorText>
                            </Field.Root>
                            <HStack>
                              <Field.Root invalid={!!errors.phone_number}>
                                <Field.Label>Phone number</Field.Label>
                                <Input {...register("phone_number")} />
                                <Field.ErrorText>
                                  {errors.phone_number?.message}
                                </Field.ErrorText>
                              </Field.Root>
                              <Field.Root invalid={!!errors.email}>
                                <Field.Label>Email</Field.Label>
                                <Input {...register("email")} />
                                <Field.ErrorText>
                                  {errors.email?.message}
                                </Field.ErrorText>
                              </Field.Root>
                            </HStack>
                            <HStack>
                              <Field.Root invalid={!!errors.country}>
                                <Controller
                                  control={control}
                                  name="country"
                                  render={({
                                    field,
                                    fieldState: { error },
                                  }) => (
                                    <>
                                      <Select.Root
                                        {...field}
                                        onValueChange={(value) => {
                                          field.onChange(value.value[0])
                                        }}
                                        collection={countries}
                                        size="sm"
                                        value={field.value ? [field.value] : []}
                                      >
                                        <Select.HiddenSelect />
                                        <Select.Label>Country</Select.Label>
                                        <Select.Control>
                                          <Select.Trigger>
                                            <Select.ValueText placeholder="Select a country" />
                                          </Select.Trigger>
                                          <Select.IndicatorGroup>
                                            <Select.Indicator />
                                          </Select.IndicatorGroup>
                                        </Select.Control>
                                        <Select.Positioner>
                                          <Select.Content>
                                            {countries.items.map((country) => (
                                              <Select.Item
                                                item={country}
                                                key={country.value}
                                              >
                                                {country.label}
                                                <Select.ItemIndicator />
                                              </Select.Item>
                                            ))}
                                          </Select.Content>
                                        </Select.Positioner>
                                      </Select.Root>
                                      <Field.ErrorText>
                                        {error?.message}
                                      </Field.ErrorText>
                                    </>
                                  )}
                                />
                              </Field.Root>
                              <Field.Root invalid={!!errors.zip_code}>
                                <Field.Label>Zip code</Field.Label>
                                <Input {...register("zip_code")} />
                                <Field.ErrorText>
                                  {errors.zip_code?.message}
                                </Field.ErrorText>
                              </Field.Root>
                            </HStack>
                            <Field.Root>
                              <Field.Label>Address</Field.Label>
                              <Textarea {...register("address")} />
                              <Field.ErrorText>
                                {errors.address?.message}
                              </Field.ErrorText>
                            </Field.Root>
                          </Fieldset.Content>
                        </Field.Root>
                      </Steps.Content>
                    </Steps.Root>
                  </Stack>
                </Fieldset.Root>
              </Dialog.Body>
              <Dialog.Footer>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  width="100%"
                >
                  <ButtonGroup>
                    {step > 0 && (
                      <Button
                        variant="surface"
                        onClick={() => setStep(step - 1)}
                      >
                        Prev
                      </Button>
                    )}
                  </ButtonGroup>
                  <Stack direction="row">
                    {step < 2 - 1 && (
                      <Button
                        variant="surface"
                        onClick={async () => {
                          const valid = await trigger(stepFields[step])
                          if (valid) setStep(step + 1)
                        }}
                      >
                        Next
                      </Button>
                    )}
                    {step === 2 - 1 && (
                      <Button variant="solid" type="submit">
                        Create organization
                      </Button>
                    )}
                  </Stack>
                </Stack>
              </Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Center>
  )
}

export default AddOrganization
