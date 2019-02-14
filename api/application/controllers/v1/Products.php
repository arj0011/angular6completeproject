<?php
defined('BASEPATH') OR exit('No direct script access allowed');

// header("Access-Control-Allow-Origin: *");
// header("Access-Control-Allow-Methods: PUT, GET, POST");


header("Access-Control-Allow-Headers:Origin, Accept, Authorization, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods:GET, POST, PUT,OPTIONS");


// header("Access-Control-Allow-Credentials:true");
// header("Access-Control-Allow-Headers:Origin, Accept, Authorization, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
// header("Access-Control-Allow-Methods:GET, POST, DELETE, PUT, HEAD, OPTIONS");
// header("Access-Control-Allow-Origin:*");
// header("Access-Control-Max-Age:1800");
// header("Cache-Control:max-age=0");

class Products extends CI_Controller {

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
/*----------------------HERE ALL API's ARE FOR ANGULAR APP----------------------------*/
	
	/*

	public function index()
	{	
		$result = array();
		$data = file_get_contents('php://input');
		$processedData = json_decode($data);
		$offset = $processedData->start;
		$limit = $processedData->length;
		$search = $processedData->search;

		$this->db->select('COUNT(p.id) AS count');
		$this->db->from('product as p');
		$this->db->where('p.status',1);
		$this->db->join('category c', 'c.id = p.category_id', 'left');
		$countArr = $this->db->get()->row();
		$recordsTotal = $countArr->count;
		$recordsFiltered = $recordsTotal;

		$this->db->select('p.id,p.product,p.price,p.discount,p.descr,c.category,CONCAT("'.base_url().'",p.image) AS image,p.created_at');
		$this->db->from('product as p');
		$this->db->where('p.status',1);
		$this->db->join('category c', 'c.id = p.category_id', 'left');
		$this->db->order_by("p.created_at", "desc");
       	$this->db->limit($limit, $offset);
    	$query  = $this->db->get();
		$result = $query->result_array();
		$draw = 0;
		if($result){
			echo '{"draw":0,"recordsTotal":'.$recordsTotal.',"recordsFiltered":'.$recordsFiltered.',"data":'.json_encode($result).'}';
		}else{
			echo '{"draw":0,"recordsTotal":0,"recordsFiltered":0,"data":'.json_encode($result).'}';
		}
	}

	public function getProductById()
	{	
		$result = array();
		$data = $_POST;
		$this->db->select('p.id,p.product,p.price,p.discount,p.descr,p.category_id,p.created_at,CONCAT("'.base_url().'",p.image) AS image','c.category');
		$this->db->from('product as p');
		$this->db->where('p.status',1);
		$this->db->where('p.id',$data['id']);
		$this->db->join('category c', 'c.id = p.category_id', 'left');
    	$query  = $this->db->get();
		$result = $query->row_array();
		if($result){
			echo '{"status":1,"msg":"product data","data":'.json_encode($result).'}';
		}else{
			echo '{"status":0,"msg":"product not found","data":'.json_encode($result).'}';
		}
	}

	public function addProduct()
	{	
		$result = array();
		$data = $_POST;
		$result = $this->db->get_where('product',array('product'=>$data['product']))->row_array();
		if(empty($result)){
			$insertdata = array('product'=>$data['product'],'category_id'=>$data['category'],'descr'=>$data['descr'],'price'=>$data['price'],'discount'=>$data['discount']);
			if(isset($_FILES['image']) && !empty($_FILES)){
				if($_FILES['image']['size'] > 0 && $_FILES['image']['error'] == 0){
					$path = $_FILES['image']['name'];
					$ext = pathinfo($path, PATHINFO_EXTENSION);
					$filepath = "./uploads/product/";
					$filename = uniqid().time().'.'.$ext;
					$image = $filepath.$filename;
					$imageURL = 'uploads/product/'.$filename;
					if(move_uploaded_file($_FILES['image']['tmp_name'], $image)){
						$insertdata['image'] = $imageURL;
					}
				}
			}
			$this->db->insert('product',$insertdata);
			echo '{"status":1,"msg":"product insert successfully","data":'.json_encode(array()).'}';
		}else{
			echo '{"status":0,"msg":"products already exist","data":'.json_encode(array()).'}';
		}
	}

	public function editProduct()
	{	
		$result = array();
		$data = $_POST;
		$result = $this->db->get_where('product',array('id'=>$data['id']))->row_array();
		if($result){
			$result1 = $this->db->get_where('product',array('id <> '=>$data['id'],'product'=>$data['product']))->row_array();
			$updatedata = array();
			if(empty($result1)){
				$updatedata = array('product'=>$data['product'],'category_id'=>$data['category'],'descr'=>$data['descr'],'price'=>$data['price'],'discount'=>$data['discount']);
				if(isset($_FILES['image']) && !empty($_FILES)){
					if($_FILES['image']['size'] > 0 && $_FILES['image']['error'] == 0){
						$path = $_FILES['image']['name'];
						$ext = pathinfo($path, PATHINFO_EXTENSION);
						$filepath = "./uploads/product/";
						$filename = uniqid().time().'.'.$ext;
						$image = $filepath.$filename;
						$imageURL = 'uploads/product/'.$filename;
						if(move_uploaded_file($_FILES['image']['tmp_name'], $image)){
							$updatedata['image'] = $imageURL;
						}
					}
				}
				$this->db->where('id', $data['id']);
				$this->db->update('product',$updatedata);
				$result = $this->db->get_where('product',array('id'=>$data['id']))->row_array();
				echo '{"status":1,"msg":"Product updated successfully","data":'.json_encode($result).'}';	
			}else{
				echo '{"status":0,"msg":"product name already exist","data":'.json_encode(array()).'}';
			}
			
		}else{
			echo '{"status":0,"msg":"product not found","data":'.$result.'}';
		}
	}

	public function changeStatus()
	{	
		$result = array();
		$data = $_POST;
		$result = $this->db->get_where('product',array('id'=>$data['id']))->row_array();
		if($result){
			$updatedata = array('status'=>0);
			$this->db->where('id', $data['id']);
			$this->db->update('product',$updatedata);
			$result = $this->db->get_where('product',array('id'=>$data['id']))->row_array();
			echo '{"status":1,"msg":"Status Changed","data":'.json_encode($result).'}';
		}else{
			echo '{"status":0,"msg":"product not found","data":'.json_encode($result).'}';
		}
	}
/*---------------------------ANGULAR API's ARE END----------------------------------*/

/*----------------------HERE ALL API's ARE FOR REACT APP----------------------------*/
	
	public function index()
	{	
		$result = array();
		$data = file_get_contents('php://input');
		$processedData = json_decode($data);
		// $offset = $processedData->start;
		// $limit = $processedData->length;
		// $search = $processedData->search;

		$this->db->select('COUNT(p.id) AS count');
		$this->db->from('product as p');
		$this->db->where('p.status',1);
		$this->db->join('category c', 'c.id = p.category_id', 'left');
		$countArr = $this->db->get()->row();
		$recordsTotal = $countArr->count;
		$recordsFiltered = $recordsTotal;

		$this->db->select('p.id,p.name,p.price,p.discount,p.description,c.name,CONCAT("'.base_url().'",p.image) AS image,p.date_created');
		$this->db->from('product as p');
		$this->db->where('p.status',1);
		$this->db->join('category c', 'c.id = p.category_id', 'left');
		$this->db->order_by("p.date_created", "desc");
       	// $this->db->limit($limit, $offset);
    	$query  = $this->db->get();
		$result = $query->result_array();
		$draw = 0;
		if($result){
			echo '{"status":1,"msg":"Products data","data":'.json_encode($result).'}';
		}else{
			echo '{"status":0,"msg":"Products not found","data":'.json_encode($result).'}';
		}
	}

	public function addProduct()
	{	
		$result = array();
		$json = file_get_contents('php://input');
        $data = json_decode($json,true);
		$result = $this->db->get_where('product',array('name'=>$data['name']))->row_array();
		if(empty($result)){
			$insertdata = array('name'=>$data['name'],'category_id'=>$data['category_id'],'description'=>$data['description'],'price'=>$data['price']);
			$this->db->insert('product',$insertdata);
			echo '{"status":1,"msg":"product insert successfully","data":'.json_encode(array()).'}';
		}else{
			echo '{"status":0,"msg":"products already exist","data":'.json_encode(array()).'}';
		}
	}

	public function getProductById()
	{	
		$result = array();
		$json = file_get_contents('php://input');
        $data = json_decode($json,true);
		$this->db->select('p.id,p.name,p.price,p.discount,p.description,p.category_id,p.date_created,CONCAT("'.base_url().'",p.image) AS image,c.name AS category');
		$this->db->from('product as p');
		$this->db->where('p.status',1);
		$this->db->where('p.id',$data['id']);
		$this->db->join('category c', 'c.id = p.category_id', 'left');
    	$query  = $this->db->get();
		$result = $query->row_array();
		if($result){
			echo '{"status":1,"msg":"product data","data":'.json_encode($result).'}';
		}else{
			echo '{"status":0,"msg":"product not found","data":'.json_encode($result).'}';
		}
	}



}
