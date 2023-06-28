export const callApi = async (api, data, cb) => {
  const res = await api(data)
  if (res.data.Code === 200) {
    cb(res)
  }
}
