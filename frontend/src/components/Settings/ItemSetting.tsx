import {
	Box,
	Button,
	Input,
	Separator,
	Stack,
	Text,
	VStack,
} from "@chakra-ui/react";
import { useState } from "react";

interface ItemSettingProps {
	settingKey: string;
	label: string;
	description?: string;
	settingValue?: string;
	edited?: string;
	onEdit?: (key: string) => void;
	onSave?: (key: string, value: string) => void;
	inputType?: string;
}

const ItemSetting = ({
	settingKey,
	label,
	description,
	settingValue,
	edited,
	onEdit,
	onSave,
	inputType = "text",
}: ItemSettingProps) => {
	const [value, setValue] = useState<string | undefined>(settingValue);

	return (
		<VStack maxW="container.lg" width="full" align="stretch" gap={2} py={2}>
			<Box>
				<Box fontWeight="bold">{label}</Box>
				{description && (
					<Box fontSize="sm" color="gray.500">
						{description}
					</Box>
				)}
			</Box>
			<Stack
				width="100%"
				direction="row"
				justifyContent="space-between"
				align="center"
				gap={3}
			>
				{edited !== settingKey ? (
					<Text textStyle="lg">{value}</Text>
				) : (
					<Input
						disabled={edited !== settingKey}
						type={inputType}
						defaultValue={value}
						size="sm"
						onChange={(e) => {
							setValue(e.target.value);
						}}
					/>
				)}
				{edited === "" && (
					<Button
						colorScheme="blue"
						size="sm"
						onClick={() => {
							onEdit?.(settingKey);
						}}
					>
						Edit
					</Button>
				)}
				{edited === settingKey && (
					<>
						<Button
							colorScheme="blue"
							size="sm"
							variant="outline"
							onClick={() => {
								onEdit?.("");
							}}
						>
							Cancel
						</Button>
						<Button
							colorScheme="blue"
							size="sm"
							onClick={() => value && onSave?.(settingKey ?? "", value)}
						>
							Save
						</Button>
					</>
				)}
			</Stack>
			<Separator my={4} />
		</VStack>
	);
};

export default ItemSetting;
