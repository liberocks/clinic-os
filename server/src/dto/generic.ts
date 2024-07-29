import type { z } from "zod";

import type { ParamsWithIdSchema } from "../schema/generic";

export type ParamsWithId = z.infer<typeof ParamsWithIdSchema>;
