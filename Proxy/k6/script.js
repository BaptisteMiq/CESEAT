import { check } from "k6";
import http from "k6/http";

export default function () {
    var url = "https://baptistemiq-ceseat-xgr777qwcvr4j-5100.githubpreview.dev/";
    let res = http.get(url);
    check(
        res,
        {
            "is status 200": (r) => r.status === 200,
        },
        { my_tag: res.body }
    );
}
