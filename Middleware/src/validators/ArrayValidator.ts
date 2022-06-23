export const minSize = (key: string, min: number) => {
    return {
        validator: (v: Array<any>) => {
            return v.length <= min;
        },
        message: `Le tableau '${key}' doit contenir au minimum ${min} éléments.`,
    };
};

export const maxSize = (key: string, max: number) => {
    return {
        validator: (v: Array<any>) => {
            return v.length <= max;
        },
        message: `Le tableau '${key}' doit contenir au maximum ${max} éléments.`,
    };
};

export const sizeBetween = (key: string, min: number, max: number) => {
    return {
        validator: (v: Array<any>) => {
            return v.length >= min && v.length <= max;
        },
        message: `Le tableau '${key}' doit contenir entre ${min} et ${max} éléments.`,
    };
}