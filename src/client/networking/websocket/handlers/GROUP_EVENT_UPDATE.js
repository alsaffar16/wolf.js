const { Events } = require('../../../../constants');

module.exports = async (api, body) => {
  const group = await api.group().getById(body.groupId);
  const event = api.event()._events.find((event) => event.id === body.id);

  return api.emit(
    Events.GROUP_EVENT_UPDATE,
    group,
    event,
    await api.event().getById(body.id)
  );
};
