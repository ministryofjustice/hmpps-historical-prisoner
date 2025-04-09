import superagent from 'superagent'

export default class GotenbergClient {
  private gotenbergHost: string

  constructor(gotenbergHost: string) {
    this.gotenbergHost = gotenbergHost
  }

  async renderPdfFromHtml(html: string, headerHtml: string, footerHtml: string, css: string): Promise<Buffer> {
    const request = superagent
      .post(`${this.gotenbergHost}/forms/chromium/convert/html`)
      .set('Content-Type', 'multi-part/form-data')
      .field('marginTop', '1.5')
      .field('marginBottom', '0.5')
      // needed to avoid blank PDFs - see https://gotenberg.dev/docs/troubleshooting#blank-pdfs
      .field('skipNetworkIdleEvent', false)
      .buffer(true)
      .attach('files', Buffer.from(html), 'index.html')
      .attach('files2', Buffer.from(headerHtml), 'header.html')
      .attach('files3', Buffer.from(footerHtml), 'footer.html')
      .attach('files4', Buffer.from(css), 'index.css')
      .responseType('blob')

    // Execute the POST to the Gotenberg container
    const response = await request
    return response.body
  }
}
