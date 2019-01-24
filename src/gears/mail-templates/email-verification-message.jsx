
/****************************************************************************************

	Copyright (c) 2018, QELQ.
	Author: Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in LICENSE

****************************************************************************************/

import React from 'react';

/****************************************************************************************/

class EmailVerificationMessage extends React.Component {
	constructor(props){
		super(props);
	}

	render() {
		let url = `http://localhost:3100/registro/verificar/${this.props.user.creationHash}`,
			company = 'QELQ';
		return (
			<div>
				<b>{company}</b>
				<p>Hola {this.props.user.displayName}</p>
				<p>Haz clic en el siguiente enlace para verificar la dirección email de tu cuenta de {company}®:</p>
				<a href={url} style={{textDecoration: 'none', fontSize: '1.2rem', fontWeight: 'bold', color: '#21618C'}}>Verificar mi cuenta</a>
				<p>Verificar tu dirección de email te permitirá usar todas las opciones de tu cuenta en cualquier momento.</p>
				<p>Si deseas más información, <a href="http://localhost:3100">haz clic aquí</a> para ver las Preguntas Frecuentes o contactar con nuestro equipo de Asistencia.</p>
				<p>Atentamente,<br/>Equipo de asistencia de {company}</p>
			</div>
		);
	}
}

/****************************************************************************************/

export default EmailVerificationMessage;

/****************************************************************************************/
