import { Inject } from "@nestjs/common";

import { UserRepositoryToken } from "../../domain/interfaces";

export const Repository = () => Inject(UserRepositoryToken);