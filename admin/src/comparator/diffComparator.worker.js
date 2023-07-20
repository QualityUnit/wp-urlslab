importScripts( '../jslib/xxhash.min.js' );

self.addEventListener( 'message', function( e ) {
	const image1 = e.data[ 0 ];
	const image2 = e.data[ 1 ];
	console.log( image1 );
	console.log( image2 );

	const diffComparator = new DiffComparator( image1, image2 );
	diffComparator.compareScreenshots();
} );

function DiffComparator( image1, image2 ) {
	this.image1 = image1;
	this.image2 = image2;

	this.compareScreenshots = function() {
		this.compareLCS( this.image1, this.image2 );
	};

	this.compareLCS = function( image1, image2 ) {
		const lineHashImage1 = this.getHash( image1 );
		const lineHashImage2 = this.getHash( image2 );

		console.log( lineHashImage1 );
		console.log( lineHashImage2 );

		const res = this.getComparisonResult( lineHashImage1, lineHashImage2 );

		console.log( 'Added => ' );
		console.log( res[ 0 ] );
		console.log( 'modified => ' );
		console.log( res[ 1 ] );
		console.log( 'deleted => ' );
		console.log( res[ 2 ] );

		self.postMessage( res );
	};

	this.getHash = function( imageBuffer ) {
		const hashLine = [];
		for ( let i = 0; i < imageBuffer.height; i++ ) {
			let pixels = '';
			for ( let j = 0; j < imageBuffer.width * 4; j += 4 ) {
				const baseIdx = j + ( i * imageBuffer.width * 4 );
				const hex = rgbaToHex(
					imageBuffer.src[ baseIdx ],
					imageBuffer.src[ baseIdx + 1 ],
					imageBuffer.src[ baseIdx + 2 ],
					imageBuffer.src[ baseIdx + 3 ]
				);
				pixels += hex;
			}
			hashLine.push( XXH.h32( pixels, 32 ).toNumber() );
		}
		return hashLine;
	};

	function rgbaToHex( r, g, b, a ) {
		r = r.toString( 16 );
		g = g.toString( 16 );
		b = b.toString( 16 );
		a = a.toString( 16 );
		if ( r.length === 1 ) {
			r = '0' + r;
		}
		if ( g.length === 1 ) {
			g = '0' + g;
		}
		if ( b.length === 1 ) {
			b = '0' + b;
		}
		if ( a.length === 1 ) {
			a = '0' + a;
		}
		return '#' + r + g + b + a;
	}

	// added has the index of After image
	// deleted has the index of Before image
	// modified contains both indexes
	this.getComparisonResult = function( imageHashBefore, imageHashAfter ) {
		const unmatchedSections = [];
		const added = [];
		const deleted = [];
		const modified = [];

		let lastUnchangedHeight = 0;
		for ( let i = 0; i < imageHashBefore.length; i++ ) {
			if ( imageHashBefore[ i ] === imageHashAfter[ i ] ) {
				if ( lastUnchangedHeight < i - 1 ) {
					unmatchedSections.push( [ lastUnchangedHeight + 1, i - 1 ] );
				}
				lastUnchangedHeight = i;
			}
		}

		if ( lastUnchangedHeight === 0 ) {
			// all has changed
			unmatchedSections.push( [ 0, imageHashBefore.length - 1 ] );
		}

		unmatchedSections.forEach( ( unmatched ) => {
			const afterStartIndex = compareSubSectionsForMod( imageHashAfter, imageHashBefore.slice( unmatched[ 0 ], unmatched[ 1 ] ) );
			if ( afterStartIndex !== -1 ) {
				for ( let k = 0; k < unmatched[ 1 ] + 1 - unmatched[ 0 ]; k++ ) {
					modified.push( { beforeIndex: unmatched[ 0 ] + k, afterIndex: afterStartIndex + k } );
				}
			} else {
				for ( let k = 0; k < unmatched[ 1 ] + 1 - unmatched[ 0 ]; k++ ) {
					deleted.push( unmatched[ 0 ] + k );
					added.push( unmatched[ 0 ] + k );
				}
			}
		} );

		return [ added, deleted, modified ];
	};

	function compareSubSectionsForMod( bgArray, smArray ) {
		/* If any of the arrays is empty then not found */
		if ( bgArray.length === 0 || smArray.length === 0 ) {
			return -1;
		}

		/* If subarray is larger than large array then not found */
		if ( smArray.length > bgArray.length ) {
			return -1;
		}

		for ( let i = 0; i < bgArray.length; i++ ) {
			if ( bgArray[ i ] === smArray[ 0 ] ) {
				let subArrayFound = true;
				for ( let j = 0; j < smArray.length; j++ ) {
					if ( bgArray.length <= i + j || smArray[ j ] !== bgArray[ i + j ] ) {
						subArrayFound = false;
						break;
					}
				}
				if ( subArrayFound ) {
					return i;
				}
			}
		}

		return -1;
	}
}
