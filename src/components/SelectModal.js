/* global chrome */
import React, { useState, useEffect } from "react";
import SearchModal from "./SearchModal";

export default function SelectModal() {
  const [options, isOpen, setChoice] = useChoices();
  return (
    isOpen && (
      <SearchModal
        entries={options.map(({ displayName, value }) => ({
          title: displayName,
          value
        }))}
        isLoading={false}
        isOpen={isOpen}
        onRequestClose={() => setChoice({ cancelled: true })}
        onSelectEntry={selected => setChoice({ selected: selected.value })}
      />
    )
  );
}

function useOnMessage(listener) {
  useEffect(() => {
    chrome.runtime.onMessage.addListener(listener);
  }, []);
}

function useChoices() {
  const [optionsAndHandler, setOptionsAndHandler] = useState([null, false]);
  useOnMessage(request => {
    switch (request.type) {
      case "select":
        const setChoice = result => {
          chrome.runtime.sendMessage(request.senderId, {
            type: "select/response",
            ...result
          });
          setOptionsAndHandler([null, false]);
        };
        setOptionsAndHandler([request.options, true, setChoice]);
        break;
    }
  });
  return optionsAndHandler;
}
