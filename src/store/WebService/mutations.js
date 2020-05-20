export function setIdentity(state, { token, key, uuid, userID }) {
  state.token = token;
  state.key = key;
  state.uuid = uuid;
  state.userID = userID;
}
