export const maxLength = (key: string, max: number) => {
    return {
        validator: (v: Array<any>) => {
            return v.length <= max;
        },
        message: `Le champ '${key}' est trop long, il doit contenir au maximum ${max} caractères.`,
    };
};

export const minLength = (key: string, min: number) => {
    return {
        validator: (v: Array<any>) => {
            return v.length >= min;
        },
        message: `Le champ '${key}' est trop court, il doit contenir au minimum ${min} caractères.`,
    };
};

export const lengthBetween = (key: string, min: number, max: number) => {
    return {
        validator: (v: Array<any>) => {
            return v.length >= min && v.length <= max;
        },
        message: `Le champ '${key}' doit contenir entre ${min} et ${max} caractères.`,
    };
}