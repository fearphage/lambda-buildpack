const fs = require('fs');

// splits export line discarding surrounding quotes
const reOrders = /^export\s+([^=]+)=(["'])?(.+)\2$/;

function parseLine(ordersLine) {
    var match = ordersLine.match(reOrders);

    if (!match) {
        console.error('Bad Export format. Exiting: %s', ordersLine);
        process.exit(1)
    }

    return {
      name: match[1].trim(),
      // escape double quotes with backslash
      value: match[3].trim().replace(/["'`]/g,'\\"'),
    };
}

module.exports = path => fs.readFileSync(path, 'utf8')
  .split(/[\r\n]+/g)
  .reduce((result, line) => {
    if (reOrders.test(line)) {
      result.push(parseLine(line));
    }

    return result;
  }, [])
;
