import * as cheerio from "cheerio";

export async function mydramalistScrapper(fetchText: string) {
    const $ = cheerio.load(fetchText);
    const name =
        $(
            "#content > div > div.container-fluid.title-container > div > div.col-lg-8.col-md-8.col-rightx > div:nth-child(1) > div.box-header.box-navbar.mdl-component > h1",
        )
            .text()
            ?.trim() || "unknown";
    const status = "Ended";
    const summary =
        $("#show-detailsxx > div.show-synopsis > p > span").text()?.trim() ||
        "unknown";
    const type = "MDL";
    const country = $(
        "#content > div > div.container-fluid.title-container > div > div.col-lg-4.col-md-4 > div > div:nth-child(2) > div.box-body.light-b > ul > li:nth-child(2)",
    )
        .text()
        ?.trim();
    let language = "English";
    switch (country) {
        case "Country: China":
            language = "Chinese";
            break;
        case "Country: South Korea":
            language = "Korean";
            break;
        case "Country: Thailand":
            language = "Thai";
            break;
        case "Country: Japan":
            language = "Japanese";
            break;
        case "Country: Taiwan":
            language = "Mandarin";
            break;
        case "Country: Hong Kong":
            language = "Cantonese";
            break;
        case "Country: Philippines":
            language = "Filipino";
            break;
        default:
            language = "English";
            break;
    }
    const image = $(
        "#content > div > div.container-fluid.title-container > div > div.col-lg-8.col-md-8.col-rightx > div:nth-child(1) > div.box-body > div > div.col-sm-4.film-cover.cover > a.block > img",
    ).attr("src");
    const t_genres = $(
        "#show-detailsxx > div.show-detailsxss > ul:nth-child(1) > li.list-item.p-a-0.show-genres > a",
    );
    const genres: string[] | null = t_genres
        .map((i, genre) => $(genre).text()?.trim())
        .get()
        .filter((genre): genre is string => genre !== undefined);
    const t_showDates = $(
        "#content > div > div.container-fluid.title-container > div > div.col-lg-4.col-md-4 > div > div:nth-child(2) > div.box-body.light-b > ul > li:nth-child(6)",
    )
        .text()
        ?.trim();
    const showDates = t_showDates?.split(":")[1]?.trim() || "Jan 1, 2000 - Jan 1, 2000";
    const [t_premiered, t_ended] =
        showDates?.includes(" - ") === true
            ? showDates?.split(" - ")
            : [showDates, showDates];
    const premiered = new Date(t_premiered).toISOString().split("T")[0];
    const ended = new Date(t_ended).toISOString().split("T")[0];
    const rating = $("#show-detailsxx div.box").text()?.trim() || "0.0";
    const runtime = (
        parseInt(
            $(
                "#content > div > div.container-fluid.title-container > div > div.col-lg-4.col-md-4 > div > div:nth-child(2) > div.box-body.light-b > ul > li:nth-child(9)",
            )
                .text()
                ?.split(":")[1]
                ?.trim() || "0",
        )
    ).toString();
    const id =
        parseInt($('head > meta[property="mdl:rid"]').attr("content") || "0") || 0;
    const show = {
        name,
        status,
        summary,
        type,
        language,
        image: {
            original: image || null,
        },
        genres,
        premiered,
        ended,
        rating,
        runtime,
        id,
    }
    return show;
}
