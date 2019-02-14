<?php
defined('BASEPATH') OR exit('No direct script access allowed');

header("Access-Control-Allow-Headers:Origin, Accept, Authorization, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, GET, POST");

class Category extends CI_Controller {

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

	public function index()
	{	
		$result = array();
		$data = file_get_contents('php://input');
		$processedData = json_decode($data);
		$offset = $processedData->start;
		$limit = $processedData->length;

		$this->db->select('COUNT(id) AS count');
    	$this->db->from('category');
    	$this->db->where('status',1);
    	$countArr = $this->db->get()->row();
		$recordsTotal = $countArr->count;
		$recordsFiltered = $recordsTotal;

		$this->db->select('id,category,created_at,CONCAT("'.base_url().'",image) AS image');
    	$this->db->from('category');
    	$this->db->where('status',1);
    	$this->db->order_by("created_at", "desc");
       	$this->db->limit($limit, $offset);
    	$query  = $this->db->get();
		$result = $query->result_array();
		if($result){
			echo '{"draw":0,"recordsTotal":'.$recordsTotal.',"recordsFiltered":'.$recordsFiltered.',"data":'.json_encode($result).'}';
		}else{
			echo '{"draw":0,"recordsTotal":0,"recordsFiltered":0,"data":'.json_encode($result).'}';
		}
	}

	public function getCategoryById()
	{	
		$result = array();
		$data = $_POST;
		$this->db->select('id,category,created_at,CONCAT("'.base_url().'",image) AS image');
		$result = $this->db->get_where('category',array('status'=>1,'id'=>$data['id']))->row_array();
		if($result){
			echo '{"status":1,"msg":"category data","data":'.json_encode($result).'}';
		}else{
			echo '{"status":0,"msg":"category not found","data":'.json_encode($result).'}';
		}
	}

	public function addCategory()
	{	
		$result = array();
		$data = $_POST;
		$result = $this->db->get_where('category',array('category'=>$data['category']))->row_array();
		if(empty($result)){
			$insertdata = array('category'=>$data['category']);
			if(isset($_FILES['image']) && !empty($_FILES)){
				if($_FILES['image']['size'] > 0 && $_FILES['image']['error'] == 0){
					$path = $_FILES['image']['name'];
					$ext = pathinfo($path, PATHINFO_EXTENSION);
					$filepath = "./uploads/category/";
					$filename = uniqid().time().'.'.$ext;
					$image = $filepath.$filename;
					$imageURL = 'uploads/category/'.$filename;
					if(move_uploaded_file($_FILES['image']['tmp_name'], $image)){
						$insertdata['image'] = $imageURL;
					}
				}
			}
			
			$this->db->insert('category',$insertdata);
			echo '{"status":1,"msg":"category insert successfully","data":'.json_encode(array()).'}';
		}else{
			echo '{"status":0,"msg":"category already exist","data":'.json_encode(array()).'}';
		}
	}

	public function editCategory()
	{	
		$result = array();
		$data = $_POST;
		$result = $this->db->get_where('category',array('id'=>$data['id']))->row_array();
		if($result){
			$result1 = $this->db->get_where('category',array('id <> '=>$data['id'],'category'=>$data['category']))->row_array();
			$updatedata = array();
			if(empty($result1)){
				if(isset($_FILES['image']) && !empty($_FILES)){
					if($_FILES['image']['size'] > 0 && $_FILES['image']['error'] == 0){
						$path = $_FILES['image']['name'];
						$ext = pathinfo($path, PATHINFO_EXTENSION);
						$filepath = "./uploads/category/";
						$filename = uniqid().time().'.'.$ext;
						$image = $filepath.$filename;
						$imageURL = 'uploads/category/'.$filename;
						if(move_uploaded_file($_FILES['image']['tmp_name'], $image)){
							$updatedata['image'] = $imageURL;
						}
					}
				}
				$updatedata['category'] = $data['category'];
				$this->db->where('id', $data['id']);
				$this->db->update('category',$updatedata);
				$result = $this->db->get_where('category',array('id'=>$data['id']))->row_array();
				echo '{"status":1,"msg":"category data","data":'.json_encode($result).'}';	
			}else{
				echo '{"status":0,"msg":"category name already exist","data":'.json_encode(array()).'}';
			}
			
		}else{
			echo '{"status":0,"msg":"category not found","data":'.$result.'}';
		}
	}

	public function changeStatus()
	{	
		$result = array();
		$data = $_POST;
		$result = $this->db->get_where('category',array('id'=>$data['id']))->row_array();
		if($result){
			$updatedata = array('status'=>0);
			$this->db->where('id', $data['id']);
			$this->db->update('category',$updatedata);
			$result = $this->db->get_where('category',array('id'=>$data['id']))->row_array();
			echo '{"status":1,"msg":"category status changed","data":'.json_encode($result).'}';
		}else{
			echo '{"status":0,"msg":"category not found","data":'.json_encode($result).'}';
		}
	}

	public function getAllCategoryName()
	{	
		$result = array();
		$this->db->select('id,category');
    	$this->db->from('category');
    	$this->db->where('status',1);
    	$query  = $this->db->get();
		$result = $query->result_array();
		if($result){
			echo '{"status":1,"msg":"category data","data":'.json_encode($result).'}';
		}else{
			echo '{"status":0,"msg":"category not found","data":'.json_encode($result).'}';
		}
	}

	/*--------------------------------------------------------------------------------*/


	public function getAllCategoryNames()
	{	
		$result = array();
		$this->db->select('id,name');
    	$this->db->from('category');
    	$this->db->where('status',1);
    	$query  = $this->db->get();
		$result = $query->result_array();
		if($result){
			echo '{"status":1,"msg":"category data","records":'.json_encode($result).'}';
		}else{
			echo '{"status":0,"msg":"category not found","records":'.json_encode($result).'}';
		}
	}
}
