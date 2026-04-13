import { serve } from "bun";
import { route } from "./routes/router.ts";

serve({
    port: 3000,
    fetch(req) {
        return route(req);
    },
});

console.log("http://localhost:3000");