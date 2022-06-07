import React, { useState, useEffect, useContext } from 'react';

import RepoList from './repo-list';
import Login from './login';

import EventBus from '@hooks/event-bus';

interface IWidgetRepositories {
  updateData: (data: any) => void;
  providerAccount: string;
}

export default function Widget({
  updateData,
  providerAccount,
}: IWidgetRepositories) {
  const Bus = useContext(EventBus);
  const [token, setToken] = useState('');
  const [providerKey, setproviderKey] = useState('');

  const setProviderHash = (providerHash: string) => {
    updateData({ providerAccount: providerHash });
  };

  const getToken = async (providerHash: string) => {
    const { token, providerKey } = await Bus.emit('vsch.ui.getProviderToken', {
      providerHash,
    });
    setproviderKey(providerKey);
    setToken(token);
  };

  useEffect(() => {
    if (!providerAccount) return;
    getToken(providerAccount);
  }, [providerAccount]);

  return providerAccount ? (
    <RepoList token={token} providerKey={providerKey} />
  ) : (
    <Login setProviderHash={setProviderHash} />
  );
}
