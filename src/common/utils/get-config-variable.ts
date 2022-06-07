export const getConfigVariable = (name: string): string => {
    return process.env[name] as string;
};
