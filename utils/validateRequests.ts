type ValidationErrors = {field: string, message: string};

export function validateUserBody(body: any) {
    const errors: ValidationErrors[] = [];

    if (typeof body.username !== 'string' && body.username.trim().length > 0) {
        errors.push({field: "username", message: "Username is required"});
    }
    if (typeof body.password !== 'string' && body.password.trim().length > 0) {
        errors.push({field: "password", message: "Password is required"});
    }
    return errors
}

export function validateTaskBody(body: any) {
    const errors: ValidationErrors[] = [];
    if (typeof body?.description !== 'string' && body.description.trim().length > 0) {
        errors.push({field: "description", message: "Description is empty"});
    }
    if (typeof body?.is_completed !== 'boolean') {
        errors.push({field: "description", message: "Invalid completion status"});
    }
    if (typeof body?.due_date !== 'number' && body?.due_date <= 0) {
        errors.push({field: "due_date", message: "Due date is invalid"});
    }
    if (typeof body?.id !== 'number' && body?.id <= 0) {
        errors.push({field: "id", message: "Id is invalid"});
    }
    return errors
}

export function validateSingleTask(body: any) {
    const errors: ValidationErrors[] = [];
    if (typeof body.id !== 'number' && body.id <= 0) {
        errors.push({field: "id", message: "id is required"});
    }
    return errors
}