export function getFormdata(request: any) {
    const formData = new FormData();

    function appendToFormData(data: any, parentKey?: string) {
        for (const key in data) {
            if (!Object.prototype.hasOwnProperty.call(data, key)) continue;

            const value = data[key];
            const fieldName = parentKey ? `${parentKey}[${key}]` : key;

            // Пропускаем только undefined
            if (value === undefined) {
                continue;
            }

            if (Array.isArray(value)) {
                value.forEach((item, index) => {
                    const arrayFieldName = `${fieldName}[${index}]`;
                    if (item === undefined) {
                        return;
                    }

                    if (typeof item === 'object' && !(item instanceof File)) {
                        appendToFormData(item, arrayFieldName);
                    } else if (item instanceof File) {
                        formData.append(`${arrayFieldName}[file]`, item, item.name);
                    } else {
                        formData.append(arrayFieldName, item === null ? '' : item);
                    }
                });
            } else if (value instanceof File) {
                formData.append(fieldName, value, value.name);
            } else if (typeof value === 'boolean') {
                formData.append(fieldName, value ? '1' : '0');
            } else if (typeof value === 'object' && value !== null) {
                appendToFormData(value, fieldName);
            } else {
                formData.append(fieldName, value === null ? '' : value);
            }
        }
    }

    appendToFormData(request);
    return formData;
}