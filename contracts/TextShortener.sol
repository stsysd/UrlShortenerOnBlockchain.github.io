pragma solidity ^0.4.23;

contract TextShortener {
  event Registraction(string key, string text);

  struct Data {
    address sender;
    string text;
  }

  uint8 constant len = 8;
  bytes constant charset = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  mapping (string => Data) keyToData;

  function getText(string _key) public view returns (string) {
    if (keyToData[_key].sender == 0) {
      return "";
    } else {
      return keyToData[_key].text;
    }
  }

  function getKey(string _text) public view returns (string) {
    string memory key = findKey(_text);
    if (keyToData[key].sender == 0) {
      return "";
    } else {
      return key;
    }
  }

  function register(string _text) public {
    string memory key = findKey(_text);
    keyToData[key].sender = msg.sender;
    keyToData[key].text = _text;
    emit Registraction(key, _text);
  }

  function findKey(string _text) internal view returns (string) {
    string memory key = encode(sha256(abi.encodePacked(msg.sender, _text)), len);
    Data memory data;
    data.sender = msg.sender;
    data.text = _text;

    while (keyToData[key].sender != 0 && !equalData(keyToData[key], data)) {
      key = encode(sha256(bytes(key)), len);
    }
    return key;
  } 

  function equalData(Data l, Data r) private pure returns (bool) {
    if (l.sender != r.sender) return false;
    return keccak256(bytes(l.text)) == keccak256(bytes(r.text));
  }

  function encode(bytes32 _key, uint8 _len) internal pure returns (string) {
    uint m = uint8(charset.length);
    uint key = uint(_key);
    string memory str = new string(_len);
    for (uint i=0; i < _len; i++) {
      bytes(str)[i] = charset[key % m];
      key = key / m;
    }
    return str;
  }
}
