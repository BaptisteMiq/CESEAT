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
};

export const email = () => {
    return {
        validator: (v: string) => {
            const emailRegex =
                /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
            const match = emailRegex.exec(v);
            return match !== null;
        },
    };
};
