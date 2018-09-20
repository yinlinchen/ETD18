console.log('Loading function');

const aws = require('aws-sdk');

const s3 = new aws.S3({ apiVersion: '2006-03-01' });

aws.config.update({
  region: 'us-east-1',
  endpoint: 'http://dynamodb.us-east-1.amazonaws.com',
});

var docClient = new aws.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
  // Get the object from the event and show its content type
  const bucket = event.Records[0].s3.bucket.name;
  const key = decodeURIComponent(
    event.Records[0].s3.object.key.replace(/\+/g, ' ')
  );
  const params = {
    Bucket: bucket,
    Key: key,
  };
  try {
    const { ContentType, Body } = await s3.getObject(params).promise();

    var records = Body.toString().split('\n');
    for (var index in records) {
      if (index != 0 && records[index].length > 1) {
        params = CSVtoArray(records[index]);

        if (params != null && params.length == 88) {
          // console.log(params);
          vid = uuid();
          // console.log(params[0]);
          console.log(params.length);

          params[1] = params[1].length > 1 ? params[1] : ' ';
          params[6] = params[6].length > 1 ? params[6] : ' ';
          params[9] = params[9].length > 1 ? params[9] : ' ';
          params[17] = params[17].length > 1 ? params[17] : ' ';
          params[24] = params[24].length > 1 ? params[24] : ' ';
          params[53] = params[53].length > 1 ? params[53] : ' ';
          params[58] = params[58].length > 1 ? params[58] : ' ';
          params[76] = params[76].length > 1 ? params[76] : ' ';
          params[80] = params[80].length > 1 ? params[80] : ' ';
          params[85] = params[85].length > 1 ? params[85] : ' ';
          params[87] = params[87].length > 1 ? params[87] : ' ';

          putRecord(
            params[0].trim(),
            params[1],
            params[6],
            params[9],
            params[17],
            params[24],
            params[76],
            params[53],
            params[58],
            params[80],
            params[85],
            params[87]
          );
        }
      }
    }

    return ContentType;
  } catch (err) {
    console.log(err);
    const message = `Error getting object ${key} from bucket ${bucket}. Make sure they exist and your bucket is in the same region as this function.`;
    console.log(message);
    throw new Error(message);
  }
};

// Write to dynamodb
function putRecord(
  vid,
  collection,
  author,
  committeechair,
  department,
  thedate,
  title,
  identifier,
  publisher,
  type,
  degreeLevel,
  degreeName
) {
  var table = 'VTETDS';

  var params = {
    TableName: table,
    Item: {
      collection: collection,
      author: author,
      committeechair: committeechair,
      department: department,
      vid: vid,
      identifier: identifier,
      thedate: thedate,
      publisher: publisher,
      degreename: degreeName,
      degreelevel: degreeLevel,
      type: type,
      title: title,
    },
  };

  console.log('Start adding a new item...');
  docClient.put(params, function(err, data) {
    if (err) {
      console.error(
        'Unable to add item. Error JSON:',
        JSON.stringify(err, null, 2)
      );
    } else {
      console.log('Added item:', JSON.stringify(data, null, 2));
    }
  });
}

// Return array of string values, or NULL if CSV string not well formed.
function CSVtoArray(text) {
  var re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
  var re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
  // Return NULL if input string is not well formed CSV string.
  if (!re_valid.test(text)) return null;
  var a = [];
  text.replace(re_value, function(m0, m1, m2, m3) {
    // Remove backslash from \' in single quoted values.
    if (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));
    // Remove backslash from \" in double quoted values.
    else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'));
    else if (m3 !== undefined) a.push(m3);
    return '';
  });
  // Handle special case of empty last value.
  if (/,\s*$/.test(text)) a.push('');
  return a;
}
