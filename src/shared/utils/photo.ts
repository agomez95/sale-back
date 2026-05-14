export const makeNumeration = (number: number): string => {
    if (number === 0) return String(number + 1).padStart(2, '0');
    return String(number).padStart(2, '0');
};