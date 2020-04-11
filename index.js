class ItemList {
  constructor(id) {
  console.log("constructor...");

    this.id = id; // this corresponds to the DOM ID in your HTML
    this.items = [];

    this.header = `
      <article class="list">
        <h1>Articles from Tridion</h1>
        `;

    this.queryBody = {
      "query": `
    {
      componentPresentations(namespaceId: 1, publicationId: 9, filter: {schema: {title: "Offering"}, template: {id: 1498}}, sort: {sortBy: LAST_PUBLISH_DATE, order: Descending}, first: 10) {
        edges {
          cursor
          node {
            itemId
            publicationId
            itemType
            ... on ComponentPresentation {
              itemType
              rawContent {
                data
              }
              component {
                title
                itemId
                schemaId
                customMetas {
                  edges {
                    node {
                      key
                      value
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    `
    }

    this.footer = `
      </article>
    `;
  }

  get body() {
    var myBody = "";
    for (var i=0; i<this.items.length; i++) {
      if (this.items[i].node.rawContent.data.Folder.Title === "_Cloneable content") continue; //loop back
      var content = this.items[i].node.rawContent.data.Content;
      var image = content.body.media.BinaryContent;
      myBody += `
        <article class="item">
          <h2>${content.headline}</h2>
          <p><img style="" width="100" src="http://sdldemo.com${image.Url}"></p>
          <p>${content.introduction}</p>
        </article>
      `;
    }
    return myBody;
  }

}

async function executeQuery(myItemList) {
  console.log("Executing Query");
  let response = await fetch('http://tridion.sdldemo.com:8081/cd/api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(myItemList.queryBody)
  });

  let result = await response.json();
  await console.log("data", result);
  myItemList.items = result.data.componentPresentations.edges;
  myItemList.id.innerHTML += myItemList.header + myItemList.body + myItemList.footer;
  return;
}
