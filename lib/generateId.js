const generateId = (firstId, secondId) => {
  return firstId > secondId ? firstId + secondId : secondId + firstId
}

export default generateId
