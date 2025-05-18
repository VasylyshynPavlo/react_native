import * as FileSystem from 'expo-file-system'

export const getFileFromUriAsync = async (uri: string) => {
  const fileInfo = await FileSystem.getInfoAsync(uri)
  if (fileInfo.exists) {
    return {
      uri,
      name: uri.split('/').pop(),
      type: 'image/jpeg',
    }
  }
  return null
}

export const getFilesFromUris = async (uris: string[]) => {
    const files = await Promise.all(
        uris.map(async (uri) => {
            const file = await getFileFromUriAsync(uri)
            return file
        })
    )
    return files.filter((file) => file !== null)
}
