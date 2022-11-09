export const callApi = async (api, data, cb = () => void 0) => {
  const res = await api(data)
  if (res.data.Code === 200) {
    console.log('api:', res)
    cb(res)
  }
}
