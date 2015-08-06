angular.module("listaTelefonica").controller("listaTelefonicaCtrl", function ($scope, $filter, $http) {
	$scope.app = "Lista Telefonica";
	$scope.contatos = [];
	$scope.operadoras = [];			

	var carregarContatos = function() {
		$http.get("http://localhost:3412/contatos").success(function (data, status) {
			$scope.contatos = data;
		}).error(function (data, status) {
			console.error(data);
		});
	};

	var carregarOperadoras = function() {
		$http.get("http://localhost:3412/operadoras").success(function (data, status) {
			$scope.operadoras = data;
		});
	}


	/*			
	$scope.adicionarContato = function (contato) {
		contato.nome = $filter('uppercase')(contato.nome);
		$scope.contatos.push(angular.copy(contato));
		delete $scope.contato;
		$scope.contatoForm.$setPristine();
	};
	*/
	$scope.adicionarContato = function (contato) {
		contato.nome = $filter('uppercase')(contato.nome);
		$http.post("http://localhost:3412/contatos", contato).success(function (data, status) {
			delete $scope.contato;					
			$scope.contatoForm.$setPristine();
			carregarContatos();					
		}).error(function (data, status) {
			console.error(data);
			$scope.message = "Aconteu um problema: " + data;
		});
	}
	$scope.carregaContrato = function (contato) {
		$http.get("http://localhost:3412/contatos/edit/" + contato.id).success(function (data, status) {
			delete $scope.contato;
			$scope.contato = data;
		}).error(function (data, status) {
			console.error(data);
		});
	}
	/*
	$scope.apagarContatos = function (contatos) {
		$scope.contatos = contatos.filter(function (contato) {					
			if (!contato.selecionado) return contato;
		});
	};
	*/
	$scope.apagarContatos = function () {
		var contatosParaExcluir = $scope.contatos.filter(function (contato) {
			if (contato.selecionado) return contato;
		});
		var retorno = false;
		$http.post("http://localhost:3412/contatos/del", contatosParaExcluir).success(function (data, status) {
			if (data == true) {
				carregarContatos();
			}
		}).error(function (data, status) {
			console.error(data);
		});
	};
	$scope.isContatoSelecionado = function (contatos) {
		return contatos.some(function (contato) {
			return contato.selecionado;
		})
	}
	$scope.ordenarPor = function (campo) {
		$scope.criterioDeOrdenacao = campo;
		$scope.direcaoDaOrdenacao = !$scope.direcaoDaOrdenacao;
	};

	carregarContatos();
	carregarOperadoras();
});