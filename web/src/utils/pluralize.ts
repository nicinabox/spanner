export default function pluralize(
    n: number,
    singular: string,
    plural?: string,
) {
    const subject = n === 1 ? singular : (plural ?? `${singular}s`);
    return `${n} ${subject}`;
}
