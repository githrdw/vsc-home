import { ButtonGroup, Button, Input, IconButton } from '@chakra-ui/react';
import { DownloadIcon } from '@chakra-ui/icons';

import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
  useCallback,
  useContext,
} from 'react';
import debounce from 'lodash.debounce';
import EventBus from '@hooks/event-bus';

import { fetchRepositories } from './providers';

export default function RepoList({ token, providerKey }: any) {
  const Bus = useContext(EventBus);
  const [repos, setRepos] = useState([]);
  const [search, setSearch] = useState('');
  const [pending, setPending] = useState(false);
  const controller = useRef(new AbortController());

  const getRepositories = async (q?: string) => {
    setPending(true);
    try {
      const values = await fetchRepositories(
        { providerKey, token },
        controller.current.signal,
        q
      );
      if (values) setRepos(values);
    } catch (e: any) {
      if (e.name !== 'AbortError') console.error(e);
    }
    setPending(false);
  };

  const requestSearch = useCallback(
    debounce((q: string) => getRepositories(q), 450),
    [token]
  );

  const clone = async (url: string) => {
    const {
      data: [{ path }],
    } = await Bus.emit('vscode.selectResource', {
      canSelectFolders: true,
    });
    console.log({ path });
    const clone = await Bus.emit('git.clone', {
      url,
      path,
    });
    console.log({ clone });
  };

  useEffect(() => {
    if (token) getRepositories();
  }, [token]);

  useEffect(() => {
    if (search === undefined) return;
    if (pending) {
      controller.current.abort();
      setPending(false);
    }
    controller.current = new AbortController();
    requestSearch(search);
  }, [search]);

  const List = useMemo(() => {
    return repos.map(({ full_name, clone_url }) => (
      <ButtonGroup variant="ghost" display="flex" key={clone_url}>
        <Button
          width="full"
          justifyContent="flex-start"
          fontWeight="normal"
          px={2}
          color="inherit"
          userSelect="unset"
          cursor="auto"
        >
          {full_name}
        </Button>
        <IconButton
          aria-label="Clone repository"
          icon={<DownloadIcon />}
          onClick={() => clone(clone_url)}
        />
      </ButtonGroup>
    ));
  }, [repos]);

  return (
    <div>
      <Input
        placeholder="Repository"
        value={search}
        onChange={val => setSearch(val.target.value)}
      />
      <ButtonGroup display="block" mt={3} spacing={0} variant="ghost">
        {List}
      </ButtonGroup>
    </div>
  );
}
