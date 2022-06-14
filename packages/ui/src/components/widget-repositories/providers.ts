const ENDPOINTS: any = {
  BITBUCKET: 'https://api.bitbucket.org/2.0/repositories?',
  GITHUB: 'https://api.github.com/user/repos',
  GITLAB: 'https://gitlab.com/api/v4/projects?',
};

const PARAMS: any = {
  BITBUCKET: (q: string) =>
    new URLSearchParams({
      role: 'contributor',
      q: q ? `full_name ~ "${q}"` : '',
      sort: '-updated_on',
    }).toString(),
  GITHUB: () => '',
  GITLAB: (search: string) =>
    new URLSearchParams({
      membership: 'true',
      search,
    }).toString(),
};

const HEADERS: any = {
  BITBUCKET: (token: string) =>
    new Headers({
      Authorization: 'Bearer ' + token,
      Accept: 'application/json',
    }),
  GITHUB: (token: string) =>
    new Headers({
      Authorization: 'Bearer ' + token,
      Accept: 'application/vnd.github.v3+json',
    }),
  GITLAB: (token: string) =>
    new Headers({
      Authorization: 'Bearer ' + token,
      Accept: 'application/json',
    }),
};

const TRANSFORM: any = {
  BITBUCKET: async (response: Response) =>
    (await response.json()).values.map(({ links, ...rest }: any) => ({
      ...rest,
      clone_url: links.clone.find(({ name }: any) => name === 'ssh').href,
      html_url: links.html.href,
    })),
  GITHUB: async (response: Response, q: string) => {
    const values = await response.json();
    if (q) return values.filter(({ full_name }: any) => full_name.includes(q));
    else return values;
  },
  GITLAB: async (response: Response) =>
    (await response.json()).map(
      ({ path_with_namespace, web_url, ssh_url_to_repo, ...rest }: any) => ({
        ...rest,
        full_name: path_with_namespace,
        clone_url: ssh_url_to_repo,
        html_url: web_url,
      })
    ),
};

export const fetchRepositories = async (
  { providerKey, token }: any,
  signal: AbortSignal,
  q = ''
) => {
  if (!['GITHUB', 'BITBUCKET', 'GITLAB'].includes(providerKey)) return;
  const response = await fetch(
    ENDPOINTS[providerKey] + PARAMS[providerKey](q),
    {
      signal,
      headers: HEADERS[providerKey](token),
    }
  );
  const repositories = await TRANSFORM[providerKey](response, q);
  return repositories;
};
