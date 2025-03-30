import jsdom from "jsdom";

export async function mydramalistScrapper(fetchText: string) {
const dom = new jsdom.JSDOM(fetchText);
const document = dom.window.document;
const name = document.querySelector("#content > div > div.container-fluid.title-container > div > div.col-lg-8.col-md-8.col-rightx > div:nth-child(1) > div.box-header.box-navbar.mdl-component > h1 > a")?.textContent?.trim() || "unknown";
const status = 'Ended';
const summary = document.querySelector('#show-detailsxx > div.show-synopsis > p > span')?.textContent?.trim() || "unknown";
const type = "MDL";
const country = document.querySelector('#content > div > div.container-fluid.title-container > div > div.col-lg-4.col-md-4 > div > div:nth-child(2) > div.box-body.light-b > ul > li:nth-child(2)')?.textContent?.trim();
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
const image = document.querySelector('#content > div > div.container-fluid.title-container > div > div.col-lg-8.col-md-8.col-rightx > div:nth-child(1) > div.box-body > div > div.col-sm-4.film-cover.cover > a.block > img')?.getAttribute('src'); 
const t_genres = document.querySelectorAll('#show-detailsxx > div.show-detailsxss > ul:nth-child(1) > li.list-item.p-a-0.show-genres > a');
const genres: string[] | null = Array.from(t_genres)
    .map((genre) => genre.textContent?.trim())
    .filter((genre): genre is string => genre !== undefined);
const t_showDates = document.querySelector('#content > div > div.container-fluid.title-container > div > div.col-lg-4.col-md-4 > div > div:nth-child(2) > div.box-body.light-b > ul > li:nth-child(4)')?.textContent?.trim();
const showDates = t_showDates?.split(":")[1]?.trim() || "Jan 1, 2000 - Jan 1, 2000";
const [t_premiered,t_ended] = showDates?.includes(" - ") === true ? showDates?.split(" - ") : [showDates, showDates];
const premiered =  new Date(t_premiered).toISOString().split("T")[0];
const ended = new Date(t_ended).toISOString().split("T")[0];
const rating = document.querySelector('#show-detailsxx div.box')?.textContent?.trim() || "0.0"
const runtime = (parseInt(document.querySelector('#content > div > div.container-fluid.title-container > div > div.col-lg-4.col-md-4 > div > div:nth-child(2) > div.box-body.light-b > ul > li:nth-child(7)')?.textContent?.split(":")[1]?.trim() || "0")).toString();
const id = parseInt(document.querySelector('head > meta[property="mdl:rid"]')?.getAttribute('content') || "0") || 0;
const show = {
    name,
    status,
    summary,
    type,
    language,
    image:{
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