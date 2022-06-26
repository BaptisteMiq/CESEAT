export const maxLength = (key: string, max: number) => {
    return {
        validator: (v: string) => {
            return v.length <= max;
        },
        message: `Le champ '${key}' est trop long, il doit contenir au maximum ${max} caractères.`,
    };
};

export const minLength = (key: string, min: number) => {
    return {
        validator: (v: string) => {
            return v.length >= min;
        },
        message: `Le champ '${key}' est trop court, il doit contenir au minimum ${min} caractères.`,
    };
};

export const lengthBetween = (key: string, min: number, max: number) => {
    return {
        validator: (v: string) => {
            return v.length >= min && v.length <= max;
        },
        message: `Le champ '${key}' doit contenir entre ${min} et ${max} caractères.`,
    };
};

export const email = () => {
    return {
        validator: (v: string) => {
            const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
            const match = emailRegex.exec(v);
            return match !== null;
        },
    };
};