import { Flex, HStack, SegmentGroup, Separator, Text } from "@chakra-ui/react";
import { useCallback, useEffect, useEffectEvent, useRef } from "react";
import {
	type IntervalType,
	useIntervalNavigation,
} from "@/hooks/useIntervalNavigation";
import { Button } from "../ui/button";

type Interval = { start: Date; end: Date };

interface IntervalSelectorProps {
	onIntervalChange: (range: Interval) => void;
}

const IntervalSelector = ({ onIntervalChange }: IntervalSelectorProps) => {
	const { intervalType, setIntervalType, interval, prev, next } =
		useIntervalNavigation("Week");

	const handlePrev = useCallback(() => {
		prev();
	}, [prev]);

	const handleNext = useCallback(() => {
		next();
	}, [next]);

	const handleSegmentChange = useCallback(
		(option: { value: string | null }) => {
			setIntervalType(option.value as IntervalType);
		},
		[setIntervalType],
	);

	const onFirstIntervalChange = useEffectEvent(() => {
		onIntervalChange(interval);
	});

	useEffect(() => {
		onFirstIntervalChange();
	}, []);

	const prevIntervalRef = useRef(interval);

	useEffect(() => {
		const prev = prevIntervalRef.current;
		const curr = interval;

		if (
			prev.start.getTime() !== curr.start.getTime() ||
			prev.end.getTime() !== curr.end.getTime()
		) {
			onIntervalChange(curr);
			prevIntervalRef.current = curr;
		}
	}, [interval, onIntervalChange]);

	return (
		<>
			<Flex justify="space-between" mb={4} gap={4} align="center">
				<HStack justify="space-between">
					<Button variant="ghost" size="sm" onClick={handlePrev}>
						← Prev
					</Button>

					<Text fontSize="sm" fontWeight="normal">
						{interval.start.toLocaleDateString()} -{" "}
						{interval.end.toLocaleDateString()}
					</Text>

					<Button variant="ghost" size="sm" onClick={handleNext}>
						Next →
					</Button>
				</HStack>

				<HStack gap={4} mb={2}>
					<SegmentGroup.Root
						size="md"
						value={intervalType}
						onValueChange={handleSegmentChange}
					>
						<SegmentGroup.Indicator />
						<SegmentGroup.Items items={["Today", "Week", "Month"]} />
					</SegmentGroup.Root>
				</HStack>
			</Flex>
			<Separator mb={4} />
		</>
	);
};

export default IntervalSelector;
