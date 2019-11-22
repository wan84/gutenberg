/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import { Toolbar } from '@wordpress/components';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import BlockMover from '../block-mover';
import BlockSwitcher from '../block-switcher';
import BlockControls from '../block-controls';
import BlockFormatControls from '../block-format-controls';
import BlockSettingsMenu from '../block-settings-menu';
import Inserter from '../inserter';

export default function BlockToolbar( { moverDirection, hasMovers = true } ) {
	const { blockClientIds, isValid, mode, rootClientId } = useSelect( ( select ) => {
		const {
			getBlockMode,
			getSelectedBlockClientIds,
			isBlockValid,
			getBlockRootClientId,
		} = select( 'core/block-editor' );
		const selectedBlockClientIds = getSelectedBlockClientIds();

		return {
			blockClientIds: selectedBlockClientIds,
			rootClientId: getBlockRootClientId( selectedBlockClientIds[ 0 ] ),
			isValid: selectedBlockClientIds.length === 1 ?
				isBlockValid( selectedBlockClientIds[ 0 ] ) :
				null,
			mode: selectedBlockClientIds.length === 1 ?
				getBlockMode( selectedBlockClientIds[ 0 ] ) :
				null,
		};
	}, [] );
	const [ isInserterShown, setIsInserterShown ] = useState( false );

	if ( blockClientIds.length === 0 ) {
		return null;
	}

	function onFocus() {
		setIsInserterShown( true );
	}

	function onBlur() {
		setIsInserterShown( false );
	}

	const inserter = (
		<Toolbar
			onFocus={ onFocus }
			onBlur={ onBlur }
			// While ideally it would be enough to capture the
			// bubbling focus event from the Inserter, due to the
			// characteristics of click focusing of `button`s in
			// Firefox and Safari, it is not reliable.
			//
			// See: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#Clicking_and_focus
			tabIndex={ -1 }
			className={ classnames(
				'block-editor-block-toolbar__inserter',
				{ 'is-visible': isInserterShown }
			) }
		>
			<Inserter clientId={ blockClientIds[ 0 ] } rootClientId={ rootClientId } />
		</Toolbar>
	);

	const shouldShowVisualToolbar = isValid && mode === 'visual';
	const isMultiToolbar = blockClientIds.length > 1;

	return (
		<div className="block-editor-block-toolbar">
			{ hasMovers && ( <BlockMover
				clientIds={ blockClientIds }
				__experimentalOrientation={ moverDirection }
			/> ) }
			{ ( shouldShowVisualToolbar || isMultiToolbar ) && <BlockSwitcher clientIds={ blockClientIds } /> }
			{ shouldShowVisualToolbar && ! isMultiToolbar && (
				<>
					<BlockControls.Slot bubblesVirtually className="block-editor-block-toolbar__slot" />
					<BlockFormatControls.Slot bubblesVirtually className="block-editor-block-toolbar__slot" />
				</>
			) }
			<BlockSettingsMenu clientIds={ blockClientIds } />
			{ inserter }
		</div>
	);
}
