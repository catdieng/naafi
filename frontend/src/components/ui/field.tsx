import { Box, Field as ChakraField, Flex } from "@chakra-ui/react";
import * as React from "react";

export interface FieldProps extends Omit<ChakraField.RootProps, "label"> {
	label?: React.ReactNode;
	helperText?: React.ReactNode;
	errorText?: React.ReactNode;
	optionalText?: React.ReactNode;
	extraActions?: React.ReactNode;
}

export const Field = React.forwardRef<HTMLDivElement, FieldProps>(
	function Field(props, ref) {
		const {
			label,
			children,
			helperText,
			errorText,
			optionalText,
			extraActions,
			...rest
		} = props;
		return (
			<ChakraField.Root ref={ref} {...rest}>
				{label && (
					<ChakraField.Label width="100%">
						<Flex
							width="100%"
							justifyContent="space-between"
							alignItems="center"
						>
							<Box>
								{label}
								<ChakraField.RequiredIndicator fallback={optionalText} />
							</Box>
							{extraActions && <Box>{extraActions}</Box>}
						</Flex>
					</ChakraField.Label>
				)}
				{children}
				{helperText && (
					<ChakraField.HelperText>{helperText}</ChakraField.HelperText>
				)}
				{errorText && (
					<ChakraField.ErrorText>{errorText}</ChakraField.ErrorText>
				)}
			</ChakraField.Root>
		);
	},
);
