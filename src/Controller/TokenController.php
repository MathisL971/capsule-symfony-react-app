<?php

namespace App\Controller;

use Twilio\Jwt\AccessToken;
use Twilio\Jwt\Grants\VideoGrant;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class TokenController extends BaseController
{
    /**
     * @Route("/token", name="token_index")
     */
    public function index(): Response
    {
        //     return $this->json([
        //         'message' => 'Welcome to your new controller!',
        //         'path' => 'src/Controller/TokenController.php',
        //     ]);

        return new Response($this->twig->render('token/index.html.twig'));
    }

    /**
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     * @Route("/token/access_token", name="token_access", methods={"POST"})
     */
    public function generate_token(Request $request)
    {
        $accountSid = getenv('TWILIO_ACCOUNT_SID');
        $apiKeySid = getenv('TWILIO_API_KEY_SID');
        $apiKeySecret = getenv('TWILIO_API_KEY_SECRET');
        $identity = uniqid();

        $roomName = json_decode($request->getContent());

        // Create an Access Token
        $token = new AccessToken(
            $accountSid,
            $apiKeySid,
            $apiKeySecret,
            3600,
            $identity
        );

        // Grant access to Video
        $grant = new VideoGrant();
        $grant->setRoom($roomName->roomName);
        $token->addGrant($grant);
        return $this->json(['token' => $token->toJWT()], 200);
    }
}
