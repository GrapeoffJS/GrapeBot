export const readConfigVariable = (name: string): string => {
    return process.env[name] ? (process.env[name] as string) : '';
};
