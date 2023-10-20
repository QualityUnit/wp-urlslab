<?php

use Urlslab_Vendor\GuzzleHttp;
use Urlslab_Vendor\OpenAPI\Client\Configuration;
use Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalAugmentPrompt;
use Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalAugmentRequest;
use Urlslab_Vendor\OpenAPI\Client\Urlslab\ContentApi;

class Urlslab_Executor_Url_Intersection extends Urlslab_Executor {
	const TYPE = 'url_intersect';

	const STOP_WORDS = array(
		"\\'ll",
		"\\'d",
		"\\'s",
		"\\'ve",
		'a',
		'able',
		'about',
		'above',
		'abst',
		'accordance',
		'according',
		'accordingly',
		'across',
		'act',
		'actually',
		'adj',
		'affected',
		'affecting',
		'affects',
		'after',
		'afterwards',
		'again',
		'against',
		'ah',
		'all',
		'almost',
		'alone',
		'along',
		'already',
		'also',
		'although',
		'always',
		'am',
		'among',
		'amongst',
		'an',
		'and',
		'announce',
		'another',
		'any',
		'anybody',
		'anyhow',
		'anymore',
		'anyone',
		'anything',
		'anyway',
		'anyways',
		'anywhere',
		'apparently',
		'approximately',
		'are',
		'aren',
		'arent',
		'arise',
		'around',
		'as',
		'aside',
		'ask',
		'asking',
		'at',
		'auth',
		'available',
		'away',
		'awfully',
		'back',
		'be',
		'became',
		'because',
		'become',
		'becomes',
		'becoming',
		'been',
		'before',
		'beforehand',
		'begin',
		'beginning',
		'beginnings',
		'begins',
		'behind',
		'being',
		'believe',
		'below',
		'beside',
		'besides',
		'between',
		'beyond',
		'biol',
		'both',
		'brief',
		'briefly',
		'but',
		'by',
		'came',
		'can',
		'can\'t',
		'cannot',
		'cause',
		'causes',
		'certain',
		'certainly',
		'com',
		'come',
		'contain',
		'containing',
		'contains',
		'could',
		'couldnt',
		'date',
		'did',
		'didn"t',
		'different',
		'do',
		'does',
		'doesn"t',
		'doing',
		'don"t',
		'done',
		'down',
		'downwards',
		'due',
		'during',
		'each',
		'effect',
		'egg',
		'eight',
		'eighty',
		'either',
		'else',
		'elsewhere',
		'end',
		'ending',
		'enough',
		'especially',
		'et-al',
		'etc',
		'even',
		'ever',
		'every',
		'everybody',
		'everyone',
		'everything',
		'everywhere',
		'except',
		'far',
		'fifth',
		'first',
		'five',
		'fix',
		'follow',
		'followed',
		'followers',
		'following',
		'follows',
		'for',
		'former',
		'formerly',
		'forth',
		'found',
		'four',
		'from',
		'further',
		'furthermore',
		'gave',
		'get',
		'gets',
		'getting',
		'give',
		'given',
		'gives',
		'giving',
		'go',
		'goes',
		'gone',
		'got',
		'gotten',
		'had',
		'happens',
		'hardly',
		'has',
		'hasn"t',
		'have',
		'haven"t',
		'having',
		'he',
		'hed',
		'hence',
		'her',
		'here',
		'hereafter',
		'hereby',
		'herein',
		'heres',
		'hereupon',
		'hers',
		'herself',
		'hes',
		'hi',
		'hid',
		'him',
		'himself',
		'his',
		'hither',
		'home',
		'how',
		'howbeit',
		'however',
		'hundred',
		'i',
		'i"ll',
		'i"ve',
		'id',
		'ie',
		'if',
		'im',
		'immediate',
		'immediately',
		'importance',
		'important',
		'in',
		'indeed',
		'index',
		'information',
		'instead',
		'into',
		'invention',
		'inward',
		'is',
		'isn"t',
		'it',
		'it"ll',
		'its',
		'itself',
		'just',
		'keep',
		'keeps',
		'kept',
		'kg',
		'km',
		'know',
		'known',
		'knows',
		'largely',
		'last',
		'lately',
		'later',
		'latter',
		'latterly',
		'least',
		'less',
		'lest',
		'let',
		'lets',
		'like',
		'liked',
		'likely',
		'line',
		'little',
		'look',
		'looking',
		'looks',
		'ltd',
		'made',
		'mainly',
		'make',
		'makes',
		'many',
		'may',
		'maybe',
		'me',
		'mean',
		'means',
		'meantime',
		'meanwhile',
		'merely',
		'mg',
		'might',
		'million',
		'miss',
		'ml',
		'more',
		'moreover',
		'most',
		'mostly',
		'mr',
		'mrs',
		'much',
		'mug',
		'must',
		'my',
		'myself',
		'name',
		'namely',
		'nay',
		'nd',
		'near',
		'nearly',
		'necessarily',
		'necessary',
		'need',
		'needs',
		'neither',
		'never',
		'nevertheless',
		'new',
		'next',
		'nine',
		'ninety',
		'no',
		'nobody',
		'non',
		'none',
		'nonetheless',
		'noone',
		'nor',
		'normally',
		'nos',
		'not',
		'noted',
		'nothing',
		'now',
		'nowhere',
		'obtain',
		'obtained',
		'obviously',
		'of',
		'off',
		'often',
		'oh',
		'ok',
		'okay',
		'old',
		'omitted',
		'on',
		'once',
		'one',
		'ones',
		'only',
		'onto',
		'or',
		'ord',
		'other',
		'others',
		'otherwise',
		'ought',
		'our',
		'ours',
		'ourselves',
		'out',
		'outside',
		'over',
		'overall',
		'owing',
		'own',
		'page',
		'pages',
		'part',
		'particular',
		'particularly',
		'past',
		'per',
		'perhaps',
		'placed',
		'please',
		'plus',
		'poorly',
		'possible',
		'possibly',
		'potentially',
		'pp',
		'predominantly',
		'present',
		'previously',
		'primarily',
		'probably',
		'promptly',
		'proud',
		'provides',
		'put',
		'quickly',
		'quite',
		'qv',
		'ran',
		'rather',
		'rd',
		're',
		'readily',
		'really',
		'recent',
		'recently',
		'ref',
		'refs',
		'regarding',
		'regardless',
		'regards',
		'related',
		'relatively',
		'research',
		'respectively',
		'resulted',
		'resulting',
		'results',
		'right',
		'run',
		'said',
		'same',
		'saw',
		'say',
		'saying',
		'says',
		'sec',
		'section',
		'see',
		'seeing',
		'seem',
		'seemed',
		'seeming',
		'seems',
		'seen',
		'self',
		'selves',
		'sent',
		'seven',
		'several',
		'shall',
		'she',
		'she"ll',
		'shed',
		'shes',
		'should',
		'shouldn"t',
		'show',
		'showed',
		'shown',
		'showns',
		'shows',
		'significant',
		'significantly',
		'similar',
		'similarly',
		'since',
		'six',
		'slightly',
		'so',
		'some',
		'somebody',
		'somehow',
		'someone',
		'somethan',
		'something',
		'sometime',
		'sometimes',
		'somewhat',
		'somewhere',
		'soon',
		'sorry',
		'specifically',
		'specified',
		'specify',
		'specifying',
		'still',
		'stop',
		'strongly',
		'sub',
		'substantially',
		'successfully',
		'such',
		'sufficiently',
		'suggest',
		'sup',
		'sure',
		'take',
		'taken',
		'taking',
		'tell',
		'tends',
		'th',
		'than',
		'thank',
		'thanks',
		'thanx',
		'that',
		'that"ll',
		'that"ve',
		'thats',
		'the',
		'their',
		'theirs',
		'them',
		'themselves',
		'then',
		'thence',
		'there',
		'there"ll',
		'there"ve',
		'thereafter',
		'thereby',
		'thered',
		'therefore',
		'therein',
		'thereof',
		'therere',
		'theres',
		'thereto',
		'thereupon',
		'these',
		'they',
		'they"ll',
		'they"ve',
		'theyd',
		'theyre',
		'think',
		'this',
		'those',
		'thou',
		'though',
		'thoughh',
		'thousand',
		'throug',
		'through',
		'throughout',
		'thru',
		'thus',
		'til',
		'tip',
		'to',
		'together',
		'too',
		'took',
		'toward',
		'towards',
		'tried',
		'tries',
		'truly',
		'try',
		'trying',
		'ts',
		'twice',
		'two',
		'under',
		'unfortunately',
		'unless',
		'unlike',
		'unlikely',
		'until',
		'unto',
		'up',
		'upon',
		'ups',
		'us',
		'use',
		'used',
		'useful',
		'usefully',
		'usefulness',
		'uses',
		'using',
		'usually',
		'value',
		'various',
		'very',
		'via',
		'viz',
		'vol',
		'vs',
		'want',
		'wants',
		'was',
		'wasnt',
		'way',
		'we',
		'we"ll',
		'we"ve',
		'we"d',
		'wed',
		'welcome',
		'went',
		'were',
		'werent',
		'what',
		'what"ll',
		'whatever',
		'whats',
		'when',
		'whence',
		'whenever',
		'where',
		'whereafter',
		'whereas',
		'whereby',
		'wherein',
		'wheres',
		'whereupon',
		'wherever',
		'whether',
		'which',
		'while',
		'whim',
		'whither',
		'who',
		'who"ll',
		'whod',
		'whoever',
		'whole',
		'whom',
		'whomever',
		'whos',
		'whose',
		'why',
		'widely',
		'willing',
		'wish',
		'with',
		'within',
		'without',
		'wont',
		'words',
		'world',
		'would',
		'wouldnt',
		'www',
		'yes',
		'yet',
		'you',
		'you"ll',
		'you"ve',
		'youd',
		'your',
		'youre',
		'yours',
		'yourself',
		'yourselves',
		'zero',
	);

	protected function schedule_subtasks( Urlslab_Task_Row $task_row ): bool {
		global $wpdb;
		$data = $task_row->get_data();
		if ( is_array( $data ) && ! empty( $data ) ) {
			$urls    = $task_row->get_data();
			$hash_id = Urlslab_Kw_Intersections_Row::compute_hash_id( $urls );
			if ( get_transient( 'urlslab_kw_intersections_' . $hash_id ) && ! empty( $wpdb->get_row( $wpdb->prepare( 'SELECT hash_id FROM ' . URLSLAB_KW_INTERSECTIONS_TABLE . ' WHERE hash_id=%s LIMIT 1', $hash_id ) ) ) ) {
				$task_row->set_result( $hash_id );
				$this->execution_finished( $task_row );

				return true;
			} else {
				$executor = new Urlslab_Executor_Download_Urls_Batch();
				$executor->schedule( $urls, $task_row );

				return true;
			}
		} else {
			$this->execution_failed( $task_row );

			return false;
		}
	}

	protected function on_all_subtasks_done( Urlslab_Task_Row $task_row ): bool {

		$childs = $this->get_child_tasks( $task_row, Urlslab_Executor_Download_Urls_Batch::TYPE );
		if ( empty( $childs ) ) {
			$this->execution_failed( $task_row );

			return false;
		}

		$batch_result     = self::get_executor( Urlslab_Executor_Download_Urls_Batch::TYPE )->get_task_result( $childs[0] );
		$processed_ngrams = array();
		foreach ( $batch_result as $url_id => $result ) {
			if ( ! isset( $result['texts'] ) || ! is_array( $result['texts'] ) ) {
				continue;
			}
			$page_ngrams = array();
			foreach ( $result['texts'] as $line ) {
				$page_ngrams = $this->array_merge( $page_ngrams, $this->get_ngrams( $line ) );
			}
			$processed_ngrams[ $url_id ] = $page_ngrams;
		}

		if ( empty( $processed_ngrams ) ) {
			$this->execution_failed( $task_row );

			return false;
		}

		//compute keywords in all pages
		$intersect     = array_intersect_key( ...$processed_ngrams );
		$unique_ngrams = array();
		foreach ( $processed_ngrams as $task_id => $page_ngrams ) {
			$unique_ngrams[] = array_keys( array_diff_key( $page_ngrams, $intersect ) );
		}
		$kws = array_count_values( array_merge( ...$unique_ngrams ) );

		//remove short keywords and numbers
		$kws = array_filter(
			$kws,
			function( $key ) {
				return ! is_numeric( $key ) && strlen( $key ) > 3;
			},
			ARRAY_FILTER_USE_KEY
		);

		//remove keywords with less than X occurrences
		$limit = ceil( count( $processed_ngrams ) * 0.2 );
		$kws   = array_filter(
			$kws,
			function( $key ) use ( $limit ) {
				return $key >= $limit;
			}
		);
		arsort( $kws );

		$keyword_all_docs_count = array();
		foreach ( $kws as $keyword => $value ) {
			foreach ( $processed_ngrams as $page_ngrams ) {
				if ( isset( $page_ngrams[ $keyword ] ) ) {
					if ( isset( $keyword_all_docs_count[ $keyword ] ) ) {
						$keyword_all_docs_count[ $keyword ] += $page_ngrams[ $keyword ];
					} else {
						$keyword_all_docs_count[ $keyword ] = $page_ngrams[ $keyword ];
					}
				}
			}
		}

		$tfd2          = array();
		$all_documents = array_sum( $kws );
		$urls_count    = count( $processed_ngrams );
		foreach ( $keyword_all_docs_count as $keyword => $value ) {
			$length           = strlen( $keyword );
			$words            = substr_count( $keyword, ' ' ) + 1;
			$tfd2[ $keyword ] = $length * $length * $words * $words * ( $kws[ $keyword ] * $kws[ $keyword ] * $kws[ $keyword ] / $urls_count ) * ( $value / $all_documents );
		}
		arsort( $tfd2 );

		$urls    = $task_row->get_data();
		$hash_id = Urlslab_Kw_Intersections_Row::compute_hash_id( $urls );

		$kw_intersections     = array();
		$kw_url_intersections = array();

		foreach ( $tfd2 as $keyword => $value ) {
			$query              = new Urlslab_Serp_Query_Row( array( 'query' => $keyword ) );
			$kw_intersections[] = new Urlslab_Kw_Intersections_Row(
				array(
					'hash_id'  => $hash_id,
					'query_id' => $query->get_query_id(),
					'query'    => $query->get_query(),
					'rating'   => $value,
				),
				false
			);

			foreach ( $processed_ngrams as $id => $page_keywords ) {
				if ( isset( $page_keywords[ $keyword ] ) ) {
					$kw_url_intersections[] = new Urlslab_Kw_Url_Intersections_Row(
						array(
							'hash_id'  => $hash_id,
							'query_id' => $query->get_query_id(),
							'url_id'   => $id,
							'words'    => $page_keywords[ $keyword ],
						),
						false
					);
				}
			}
		}

		global $wpdb;
		$wpdb->delete( URLSLAB_KW_INTERSECTIONS_TABLE, array( 'hash_id' => $hash_id ) );
		$wpdb->delete( URLSLAB_KW_URL_INTERSECTIONS_TABLE, array( 'hash_id' => $hash_id ) );

		if ( ! empty( $kw_intersections ) ) {
			$kw_intersections[0]->insert_all( $kw_intersections, true );
		}
		if ( ! empty( $kw_url_intersections ) ) {
			$kw_url_intersections[0]->insert_all( $kw_url_intersections, true );
		}
		set_transient( 'urlslab_kw_intersections_' . $hash_id, $task_row->get_task_id(), 900 );
		$task_row->set_result( $hash_id );
		$this->execution_finished( $task_row );

		return true;
	}

	protected function get_type(): string {
		return self::TYPE;
	}

	private function get_ngrams( $line, $min = 1, $max = 3 ): array {
		$words  = preg_split( '/[\W]+/', $line );
		$ngrams = array();
		foreach ( $words as $idx => $word ) {
			for ( $i = $min ; $i <= $max ; $i ++ ) {
				if ( $idx + $i <= count( $words ) ) {

					$valid_words = array_filter(
						array_slice( $words, $idx, $i ),
						function( $word ) {
							return strlen( $word ) > 3 && ! in_array( $word, self::STOP_WORDS );
						}
					);

					if ( count( $valid_words ) < $i ) {
						break;
					}

					$ngram = strtolower( implode( ' ', array_slice( $words, $idx, $i ) ) );
					if ( ! isset( $ngrams[ $ngram ] ) ) {
						$ngrams[ $ngram ] = 1;
					} else {
						$ngrams[ $ngram ] ++;
					}
				} else {
					break;
				}
			}
		}

		return $ngrams;
	}

	private function array_merge( array $a1, array $a2 ): array {
		$sums = array();
		foreach ( array_keys( $a1 + $a2 ) as $key ) {
			if ( isset( $a1[ $key ] ) && isset( $a2[ $key ] ) ) {
				$sums[ $key ] = $a1[ $key ] + $a2[ $key ];
			} else if ( isset( $a1[ $key ] ) ) {
				$sums[ $key ] = $a1[ $key ];
			} else {
				$sums[ $key ] = $a2[ $key ];
			}
		}

		return $sums;
	}
}
