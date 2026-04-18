"use server";

export async function getPersonsByNameFromTvMaze(name: string) {
  try {
    // https://api.tvmaze.com/search/people?q=kivanc
    const result = await fetch(`https://api.tvmaze.com/search/people?q=${encodeURIComponent(name)}`);
    const response = await result.json();
    return response as
      { 
        score: number,
        person:
        {
          id: number | null,
          name: string | null,
          url: string | null,
          country: {
            name: string,
            code: string,
            timezone: string,
          } | null,
          gender: string | null,
          image: {
            medium: string,
            original: string,
          } | null
        }
      }[];
  }
  catch (error) {
    console.log(error);
    return [];
  }
}

export async function getWorksByPersonIdFromTvMaze(id: number){
  try{
    const result = await fetch(`https://api.tvmaze.com/people/${id}/castcredits?embed=show`);
    const response = await result.json();
    return response as 
      {
        self: boolean,
        voice: boolean,
        _links: {
          show: {
            href: string,
            name: string,
          },
          character: {
            href: string,
            name: string
          }
        },
        _embedded:{
          show:{
            id: number,
            url: string,
            name: string,
            type: string,
            language: string,
            genres: string[],
            status: string,
            runtime: number,
            averageRuntime: number,
            premiered: string,
            ended: string,
            rating:{
              average: number | null
            },
            image: {
              medium: string,
              original: string
            } | null,
            summary: string | null,
          }
        }
    }[];
  }
  catch(error){
    console.log(error);
  }
}