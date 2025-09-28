import {
	Box,
	Button,
	Flex,
	HStack,
	Input,
	Separator,
	Stack,
	Text,
	VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Field } from "../ui/field";

interface ItemStructuredSettingProps<T extends Record<string, string>> {
	settingKey: string;
	label: string;
	description?: string;
	settingValue?: T;
	edited?: string;
	onEdit?: (key: string) => void;
	onSave?: (key: string, value: T) => void;
}

const ItemStructuredSetting = <T extends Record<string, string>>({
	settingKey,
	label,
	description,
	settingValue,
	edited,
	onEdit,
	onSave,
}: ItemStructuredSettingProps<T>) => {
	const [value, setValue] = useState<T>(settingValue || ({} as T));

	useEffect(() => {
		setValue(settingValue || ({} as T));
	}, [settingValue]);

	const handleChange = (field: keyof T, val: string) => {
		setValue({ ...value, [field]: val });
	};

	const fields = Object.keys(value) as (keyof T)[];

	return (
		<VStack maxW="container.lg" width="full" align="stretch" gap={2} py={2}>
			<Flex width="full" gap={6} align="flex-start">
				{/* Left column: Label + Description */}
				<Box flex="1">
					<Box fontWeight="bold">{label}</Box>
					{description && (
						<Box fontSize="sm" color="gray.500">
							{description}
						</Box>
					)}
				</Box>

				{/* Right column: Fields + Buttons */}
				<Box flex="1">
					<Stack direction="column" gap={2}>
						{fields.map((field) =>
							edited !== settingKey ? (
								<>
									<HStack>
										<Text
											textTransform="capitalize"
											fontWeight="medium"
											textStyle="md"
										>
											{String(field)} :
										</Text>
										<Text textStyle="md">{value[field]}</Text>
									</HStack>
									<Separator />
								</>
							) : (
								<Field
									orientation="horizontal"
									textTransform="capitalize"
									label={String(field)}
								>
									<Input
										key={String(field)}
										disabled={edited !== settingKey}
										placeholder={String(field)}
										value={value[field] ?? ""}
										size="sm"
										onChange={(e) => handleChange(field, e.target.value)}
									/>
								</Field>
							),
						)}
						<Stack direction="row" gap={2} mt={4}>
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
										colorScheme="gray"
										size="sm"
										variant="outline"
										onClick={() => {
											setValue(settingValue || ({} as T));
											onEdit?.("");
										}}
									>
										Cancel
									</Button>
									<Button
										colorScheme="blue"
										size="sm"
										onClick={() => {
											onSave?.(settingKey, value);
										}}
									>
										Save
									</Button>
								</>
							)}
						</Stack>
					</Stack>
				</Box>
			</Flex>

			<Separator my={4} />
		</VStack>
	);
};

export default ItemStructuredSetting;
