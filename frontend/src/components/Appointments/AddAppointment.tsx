import {
    Button,
    DialogTitle,
} from "@chakra-ui/react"
import { useState } from "react"
import dayjs from "dayjs"
import {
    DialogCloseTrigger,
    DialogContent,
    DialogHeader,
    DialogRoot,
    DialogTrigger,
} from "../ui/dialog"
import useCustomToast from "@/hooks/useCustomToast"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import { type ApiError, type AppointmentCreate, AppointmentCreateSchema, AppointmentsService } from "@/client"
import { type SubmitHandler, useForm } from "react-hook-form"
import { handleError } from "@/utils"
import { FaPlus } from "react-icons/fa"
import { FormAppointment } from "./FormAppointment"
import { useAppointmentContext } from "./ProviderAppointment"

const AddAppointment = () => {
    const [isOpen, setIsOpen] = useState(false)
    const queryClient = useQueryClient()
    const { showSuccessToast } = useCustomToast()
    const { selectedSlot, setSelectedSlot } = useAppointmentContext()

    const {
        reset,
        formState: { isSubmitting },
    } = useForm<AppointmentCreate>({
        mode: "onBlur",
        criteriaMode: "all",
        resolver: zodResolver(AppointmentCreateSchema),
    })

    const mutation = useMutation({
        mutationFn: (data: AppointmentCreate) =>
            AppointmentsService.createAppointment({ requestBody: data }),
        onSuccess: () => {
            showSuccessToast("Appointment created successfully.")
            reset()
            queryClient.invalidateQueries({ queryKey: ["appointments"] })
            setIsOpen(false)
        },
        onError: (error: ApiError) => {
            handleError(error)
        },
    })

    const onSubmit: SubmitHandler<AppointmentCreate> = (data) => {
        mutation.mutate(data)
    }

    return (
        <DialogRoot
            size={{ base: "xs", md: "md" }}
            placement="center"
            open={isOpen || !!selectedSlot}
            onOpenChange={({ open }) => { 
                setIsOpen(open) 
                if(!open) setSelectedSlot(null)
            }}
        >
            <DialogTrigger asChild>
                <Button value="add-appointment" size="sm">
                    <FaPlus fontSize="16px" />
                    Add Appointment
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Appointment</DialogTitle>
                    <DialogCloseTrigger />
                </DialogHeader>
                <FormAppointment
                    defaultValues={
                        selectedSlot
                            ? {
                                  start: dayjs(selectedSlot.start).format("YYYY-MM-DDTHH:mm"),
                                  end: dayjs(selectedSlot.end).format("YYYY-MM-DDTHH:mm"),
                              }
                            : {}
                    }
                    onSubmit={onSubmit}
                    onCancel={() => {
                        setIsOpen(false)
                        setSelectedSlot(null)
                    }}
                    isSubmitting={isSubmitting}
                    submitLabel="Save"
                />
            </DialogContent>
        </DialogRoot>
    )
}

export default AddAppointment