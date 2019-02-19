function pad(n, width, z = '0') {
	return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

export const hexDump = (buf) => {
	let view = new Uint8Array(buf);
	let hex = Array.from(view).map(v => pad(v.toString(16), 2));
	return `${hex.join('')}`;
}

