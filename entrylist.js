/* based on
  http://rest.elkstein.org/2008/02/using-rest-in-javascript.html
*/

function createRequest() {
  var result = null;
  if (window.XMLHttpRequest) {
    // FireFox, Safari, etc.
    result = new XMLHttpRequest();
    if (typeof(result.overrideMimeType) != 'undefined') {
      result.overrideMimeType('text/xml'); // Or anything else
    }
  }
  else if (window.ActiveXObject) {
    // MSIE
    result = new ActiveXObject("Microsoft.XMLHTTP");
  }
  else {
    // No known mechanism -- consider aborting the application
  }
  return result;
}

function clearParent(parentElement) {
  while(parentElement.hasChildNodes()) {
    parentElement.removeChild(parentElement.childNodes[0])
  }
}

function addPostList(postList, parentElement) {
  clearParent(parentElement)

  /* generated structure:
  <a href="ref" class="blog-entry">
    <table>
      <tr>
        <td class="date">6/5/1234</td>
        <td class="title">New Blogentry!</td>
      </tr>
    </table>
  </a> */
  for(i = 0; i < postList.items.length; i++) {
    // create DOM structure up from bottom to top
    date_value = postList.items[i].published.substring(0, 10)
    title_value = postList.items[i].title
    url_value = postList.items[i].url

    date_text = document.createTextNode(date_value)
    date_td = document.createElement("TD")
    date_td.className = "date"
    date_td.appendChild(date_text)

    title_text = document.createTextNode(title_value)
    title_td = document.createElement("TD")
    title_td.className = "title"
    title_td.appendChild(title_text)

    row = document.createElement("TR")
    row.appendChild(date_td)
    row.appendChild(title_td)

    table = document.createElement("TABLE")
    table.appendChild(row)

    var a = document.createElement("A")
    a.href = url_value
    a.appendChild(table)
    a.className = "blog-entry"
    parentElement.appendChild(a)
  }
}

function displayDownloadError(parentElement) {
  clearParent(parentElement)

  text = document.createTextNode(
           "Could not retrieve blog entries. Please try again later."
         )

  span = document.createElement("div")
  span.className = "error"
  span.appendChild(text)

  parentElement.appendChild(span)
}

function listBlogEntries(targetElement) {
  var req = createRequest(); // defined above

  url =
  'https://www.googleapis.com/blogger/v3/blogs/3760048566635450865/posts?' +
  'key=AIzaSyChscEexHFETrsCMPNdQh0zAUof6GNnO3Q&maxResults=14' +
  '&fetchBodies=false'

  // Create the callback:
  req.onreadystatechange = function() {
    if (req.readyState != 4) return; // Not there yet
    if (req.status != 200) {
      // Handle request failure here...
      displayDownloadError(targetElement)
      return
    }
    // Request successful, read the response
    var resp = req.responseText;
    parsed = JSON.parse(resp)

    addPostList(parsed, targetElement)
  }

  req.open("GET", url, true);
  req.send(null);
}
