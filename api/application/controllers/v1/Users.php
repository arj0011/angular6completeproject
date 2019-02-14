<?php
defined('BASEPATH') OR exit('No direct script access allowed');

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, GET, POST");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
// header("content-type','application/json");

class Users extends CI_Controller {

	/**
	 * Index Page for this controller.
	 *
	 * Maps to the following URL
	 * 		http://example.com/index.php/welcome
	 *	- or -
	 * 		http://example.com/index.php/welcome/index
	 *	- or -
	 * Since this controller is set as the default controller in
	 * config/routes.php, it's displayed at http://example.com/
	 *
	 * So any other public methods not prefixed with an underscore will
	 * map to /index.php/welcome/<method_name>
	 * @see https://codeigniter.com/user_guide/general/urls.html
	 */

	public function signup()
	{
		$result = array();
		$postdata = file_get_contents("php://input");
		$data = json_decode($postdata,true);
		$id = $this->db->insert('users',$data);
		if($id){
			echo '{"status":1,"msg":"registration success","data":'.json_encode($result).'}';
		}else{
			echo '{"status":0,"msg":"registration failed","data":'.$result.'}';
		}
	}
	public function login()
	{
		
		$user = array();
		$data = $_POST;
		$user = $this->db->get_where('users',array('email'=>$data['email'],'password'=>$data['password']))->row_array();
		if($user){
			echo '{"status":1,"msg":"login success","data":'.json_encode($user).'}';
		}else{
			echo '{"status":0,"msg":"login failed","data":'.json_encode($user).'}';
		}
	}

	public function index()
	{	
		$result = array();
		$postdata = file_get_contents("php://input");
		$data = json_decode($postdata,true);
		$result = $this->db->get_where('users',array('status'=>1))->result_array();
		if($result){
			echo '{"status":1,"msg":"users data","data":'.json_encode($result).'}';
		}else{
			echo '{"status":0,"msg":"users not found","data":'.$result.'}';
		}
	}

	public function getUserById()
	{	
		$result = array();
		$postdata = file_get_contents("php://input");
		$data = json_decode($postdata,true);
		$result = $this->db->get_where('users',array('status'=>1,'id'=>$data['id']))->row_array();
		if($result){
			echo '{"status":1,"msg":"user data","data":'.json_encode($result).'}';
		}else{
			echo '{"status":0,"msg":"user not found","data":'.json_encode($result).'}';
		}
	}

	public function editUser()
	{	
		$result = array();
		$postdata = file_get_contents("php://input");
		$data = json_decode($postdata,true);
		$result = $this->db->get_where('users',array('id'=>$data['id']))->row_array();
		if($result){
			$updatedata = array('firstname'=>$data['firstname'],'lastname'=>$data['lastname'],'username'=>$data['username']);
			$this->db->where('id', $data['id']);
			$this->db->update('users',$updatedata);
			$result = $this->db->get_where('users',array('id'=>$data['id']))->row_array();
			echo '{"status":1,"msg":"user data","data":'.json_encode($result).'}';	
		}else{
			echo '{"status":0,"msg":"user not found","data":'.$result.'}';
		}
	}

	public function changeStatus()
	{	
		$result = array();
		$postdata = file_get_contents("php://input");
		$data = json_decode($postdata,true);
		$result = $this->db->get_where('user',array('id'=>$data['id']))->row_array();
		if($result){
			$updatedata = array('status'=>$data['status']);
			$this->db->where('id', $data['id']);
			$this->db->update('users',$updatedata);
			$result = $this->db->get_where('users',array('id'=>$data['id']))->row_array();
			echo '{"status":1,"msg":"user data","data":'.json_encode($result).'}';
		}else{
			echo '{"status":0,"msg":"user not found","data":'.json_encode($result).'}';
		}
	}
}
