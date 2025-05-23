import type { AxiosError } from 'axios';

export type ModifiedAxiosError = AxiosError & {
    response: { data: { message: string } };
};
