import {
	Box,
	Button,
	Image,
	Input,
	Separator,
	Stack,
	VStack,
} from "@chakra-ui/react";
import { useState } from "react";

interface ItemImageSettingProps {
	settingKey: string;
	label: string;
	description?: string;
	settingValue?: string; // file URL (logo, etc.)
	onEdit?: (key: string, file: File) => void;
}

const ItemImageSetting = ({
	settingKey,
	label,
	description,
	settingValue,
	onEdit,
}: ItemImageSettingProps) => {
	const [editing, setEditing] = useState(false);
	const [preview, setPreview] = useState(settingValue);

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

			<Stack direction="row" gap={3} align="center">
				{preview && (
					<Image
						src={preview}
						alt={label}
						boxSize="50px"
						objectFit="cover"
						borderRadius="md"
					/>
				)}

				{!editing ? (
					<Button
						colorScheme="blue"
						size="sm"
						variant="outline"
						onClick={() => setEditing(true)}
					>
						Upload
					</Button>
				) : (
					<>
						<Input
							type="file"
							accept="image/*"
							size="sm"
							onChange={(e) => {
								const file = e.target.files?.[0];
								if (file) {
									setPreview(URL.createObjectURL(file));
									onEdit?.(settingKey, file);
								}
								setEditing(false);
							}}
						/>
						<Button
							colorScheme="gray"
							size="sm"
							variant="outline"
							onClick={() => setEditing(false)}
						>
							Cancel
						</Button>
					</>
				)}
			</Stack>

			<Separator my={4} />
		</VStack>
	);
};

export default ItemImageSetting;
