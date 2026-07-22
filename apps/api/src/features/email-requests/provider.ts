function sleep(ms : number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}


export async function sendEmail() {
  await sleep(1000)

  const succeeded = Math.random() > 0.3

  if (!succeeded) {
    throw new Error("provider temporarily unavailable")
  }
}


