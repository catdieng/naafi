export function overlaps(
    startA: Date,
    endA: Date,
    startB: Date,
    endB: Date
) {
    return startA < endB && endA > startB;
}