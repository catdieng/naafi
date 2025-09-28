import {
  Button,
  DialogActionTrigger,
  DialogTitle,
  Input,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useId, useState } from "react"
import { type SubmitHandler, useForm } from "react-hook-form"
import { FiEdit3 } from "react-icons/fi"
import {
  type CustomerCreate,
  CustomerCreateSchema,
  type CustomerPublic,
  CustomersService,
} from "@/client"
import type { ApiError } from "@/client/core/ApiError"
import useCustomToast from "@/hooks/useCustomToast"
import { emailPattern, handleError, telPattern } from "@/utils"
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

interface EditCustomerProps {
  customer: CustomerPublic
}

const EditCustomer = ({ customer }: EditCustomerProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient()
  const { showSuccessToast } = useCustomToast()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<CustomerCreate>({
    mode: "onBlur",
    criteriaMode: "all",
    resolver: zodResolver(CustomerCreateSchema),
    defaultValues: {
      ...customer,
    },
  })

  const mutation = useMutation({
    mutationFn: (data: CustomerCreate) =>
      CustomersService.createCustomer({ requestBody: data }),
    onSuccess: () => {
      showSuccessToast("Customer updated successfully.")
      reset()
      setIsOpen(false)
    },
    onError: (err: ApiError) => {
      handleError(err)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] })
    },
  })

  const onSubmit: SubmitHandler<CustomerCreate> = (data) => {
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
        <Button variant="ghost" value="edit-customer">
          <FiEdit3 />
          Edit Customer
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <Text mb={4}>Fill in the details to edit a new customer.</Text>
            <VStack gap={4}>
              <Field
                required
                invalid={!!errors.full_name}
                errorText={errors.full_name?.message}
                label="Name"
              >
                <Input
                  id={useId()}
                  {...register("full_name", {
                    required: "Full name is required.",
                  })}
                  placeholder="Full name"
                  type="text"
                />
              </Field>
              <Field
                required
                invalid={!!errors.email}
                errorText={errors.email?.message}
                label="Email"
              >
                <Input
                  id={useId()}
                  {...register("email", {
                    required: "Email is required",
                    pattern: emailPattern,
                  })}
                  placeholder="Email"
                  type="email"
                />
              </Field>

              <Field
                required
                invalid={!!errors.phone}
                errorText={errors.phone?.message}
                label="Phone"
              >
                <Input
                  id={useId()}
                  {...register("phone", {
                    required: "Phone number is required",
                    pattern: telPattern,
                  })}
                  placeholder="Phone number"
                  type="tel"
                />
              </Field>

              <Field
                invalid={!!errors.address}
                errorText={errors.address?.message}
                label="Editress"
              >
                <Textarea
                  id={useId()}
                  {...register("address")}
                  placeholder="Street editress, city, postal code"
                ></Textarea>
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

export default EditCustomer
